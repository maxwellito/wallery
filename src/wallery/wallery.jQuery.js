/**
 * Wallery class
 * jQuery plugin to control the 4 maps
 * and simulate the wallery
 * 
 *
 * Options:
 *	navigation:		string		border|drag
 *	dev:			boolean		false
 *	click:			function	null
 *
 */

(function($){

	$.fn.extend({

		//plugin name
		wallery: function(options) {

			//Settings list and the default values
			var defaults = {
				navigation:		'drag',
				intro:			true,
				dev:			false,
				click:			null
			};

			options = $.extend(defaults, options);

			return this.each(function() {

				var opt = options;
				opt.el = this;

				new WalleryControl(opt).start();

			});
		}
	});

})(jQuery);


/**
 * WalleryControl class
 * Javascript class to control the 4 maps
 * and simulate the wallery
 *
 * Used by the jQuery plug-in
 * 
 *
 */

var WalleryControl = function (settings)
{

	/* jQuery object of the wallery DOM element
	 *
	 * @var		jQuery object
	 */
	this.el = null;

	/* Map size variables (in pixels)
	 *
	 * @var		int
	 */
	this.map_width		= 0;
	this.map_height		= 0;

	/* Current position of the top-left map (in pixels)
	 *
	 * @var		int
	 */
	this.current_x		= 0;
	this.current_y		= 0;

	/* Border mode variables
	 *
	 * @var		Object
	 */
	this.speed_x		= 0.0;			// Current speed (between -1 and 1)
	this.speed_y		= 0.0;
	this.orientation_x	= 0.0;			// New speed to get (between -1 and 1)
	this.orientation_y	= 0.0;
	this.speed_ratio	= 50;			// Max speed (px)

	/* Drag mode variable
	 *
	 * @var		int
	 */
	this.drag_point_x	= 0;
	this.drag_point_y	= 0;

	/* Model of the object
	 *
	 * @var		Object
	 */
	this.zone_sensible	= null;			// Sensitive border for MVMT

	/* State variable of the object
	 *
	 * @var		Object
	 */
	this.on_warning		= false;
	this.mvmt_allowed	= true;
	this.mvmt_interval	= null;

	/* Matrix of map position
	 *
	 * @var		Array[2x2]
	 */
	this.position = [];

	/* Options of the instance
	 *
	 * @var		Object
	 */
	this.options = {};


	/** 
	 * Initialisation method
	 * Keep params from the model object
	 *
	 * settings :
	 *		el(string)	jQuery selector for the wallery DOM object
	 *	
	 * @param	object	settings	Params to set the object
	 * @return  void	
	 */
	this.init = function (settings) {

		// Param tests
		if (settings['el'] === undefined)
			return;

		this.el = $(settings['el']);
		this.options = settings;

		// DOM tests
		if (this.el.length != 1 ||
			this.el.children('.map0').length != 1 || this.el.children('.map1').length != 1 ||
			this.el.children('.map2').length != 1 || this.el.children('.map3').length != 1)
			return;

		// Init map size
		this.map_width  = $(".map0").width();
		this.map_height = $(".map0").height();

		//this.position = [[0, 1],[2, 3]];
		this.position = [[this.el.children('.map0'), this.el.children('.map1')],
						[this.el.children('.map2'), this.el.children('.map3')]];

		this.moveMap(0, 0);
	},


	/* Start *****************************************************************/

	/**
	 * Start navigation
	 * 
	 * @return void
	 */
	this.start = function () {

		// Start the intro animation
		this.startIntro();

		// Update interaction zone
		this.updateZoneSensible();

		// Listen mouse/fingers event
		this.listenEvents();

		// Listen window 
		this.el.resize($.proxy(this, 'windowCheck'));

		// Listen the clicks
		if (this.options.click !== null)
			this.el.find('.img_container').click( this.options.click );
	},


	/**
	 * Start the introduction
	 * 
	 * @return void
	 */
	this.startIntro = function () {

		// : pop effect on each picture
		if (this.options.intro) {
			$(".img_container").each( function(){
				$(this)
					.delay( Math.round(Math.random()*10)*200 )
					.fadeIn("normal");
			});
		}
		else {
			$(".img_container").show();
		}
	},

	/**
	 * Listen events
	 * 
	 * @return void
	 */
	this.listenEvents = function () {

		switch (this.options.navigation) {
			case 'drag':
				this.el.bind('mousedown',	$.proxy(this, 'startDrag'));
				this.el.bind('touchstart',	$.proxy(this, 'startDrag'));
				// this.el.bind('mousemove',	$.proxy(this, 'mvmtDrag'));
				// this.el.bind('touchmove',	$.proxy(this, 'mvmtDrag'));
				this.el.bind('mouseup',		$.proxy(this, 'stopDrag'));
				this.el.bind('mouseout',	$.proxy(this, 'stopDrag'));
				this.el.bind('touchend',	$.proxy(this, 'stopDrag'));
				this.el.find("img").mousedown( function (e) {return false;});
				break;

			case 'border':
				this.el.mousemove($.proxy(this, 'updateSpeed'));
				this.log('border mode set');
				break;
		}
	},


	/* User interface ********************************************************/

	/**
	 * Play navigation
	 * method to enable the navigation
	 * 
	 * @return void
	 */
	this.playNavigation = function () {

		this.mvmt_allowed = true;
	},

	/**
	 * Stop navigation
	 * method to disable the navigation
	 * 
	 * @return void
	 */
	this.stopNavigation = function () {

		// Stop the mouvement
		this.mvmt_allowed	= false;
		this.orientation_x	= 0;
		this.orientation_y	= 0;
	},


	/* Engine ****************************************************************/

	/**
	 * Move the map
	 * simple method to move the map with a simple
	 * vector properties
	 * 
	 * @param	int		x
	 * @param	int		y	
	 * @return	void
	 */
	this.moveMap = function(x, y) {

		// Get the new map position
		var position	= this.position;
		this.current_x	= this.current_x + x;
		this.current_y	= this.current_y + y;

		// Update positions on Y
		if ( this.current_y > 0 ) {
			// Top case
			this.current_y -= this.map_height;
			this.position = [[position[1][0], position[1][1]],
							[position[0][0], position[0][1]]];
		}
		else if ( this.current_y < -this.map_height ) {
			// Bottom case
			this.current_y += this.map_height;
			this.position = [[position[1][0], position[1][1]],
							[position[0][0], position[0][1]]];
		}

		// Update positions on X
		if ( this.current_x > 0 ) {
			// Left case
			this.current_x -= this.map_width;
			this.position = [[position[0][1], position[0][0]],
							[position[1][1], position[1][0]]];
		}
		else if ( this.current_x < - this.map_width ) {
			// Right case
			this.current_x += this.map_width;
			this.position = [[position[0][1], position[0][0]],
							[position[1][1], position[1][0]]];
		}

		// Update maps positions
		this.position[0][0].css({	left:	this.current_x + "px",
									top:	this.current_y + "px"});
		this.position[0][1].css({	left:	(this.current_x + this.map_width)  + "px",
									top:	this.current_y + "px"});
		this.position[1][0].css({	left:	this.current_x + "px",
									top:	(this.current_y + this.map_height) + "px"});
		this.position[1][1].css({	left:	(this.current_x + this.map_width)  + "px",
									top:	(this.current_y + this.map_height) + "px"});
	},

	/**
	 * Check window size
	 * just a security point
	 * 
	 * @param	event object	e
	 * @return	void
	 */
	this.windowCheck = function (e) {

		// If the window size is higher than the map size : STOP
		if ( !this.on_warning && (this.el.width() > this.map_width || this.el.height() > this.map_height) ) {
			// lock_screen
			$(".map").hide("normal");
			$("#warning").show("slow");
			this.on_warning = true;
		}
		else if ( this.on_warning && this.el.width() < this.map_width && this.el.height() < this.map_height ) {
			// unlock_screen
			$(".map").show("slow");
			$("#warning").hide("normal");
			this.on_warning = false;
		}

		// Update interactive zone
		this.updateZoneSensible();
	},

	/**
	 * Update elements about size of the window
	 * 
	 * @return void
	 */
	this.updateZoneSensible = function () {
		this.zone_sensible = this.el.width() * this.el.height() / 7500;
	},


	/* Events: Border mode ***************************************************/

	/**
	 * Update speed
	 * 
	 * @param	event object	e
	 * @return	void
	 */
	this.updateSpeed = function (e) {

		// Mouse position
		var mouse_x = e.pageX;
		var mouse_y = e.pageY;

		if ( !this.mvmt_allowed )
			return;

		// on X
		if ( mouse_x < this.zone_sensible ) {
			this.orientation_x = 1;
		} else if  ( mouse_x > this.el.width() - this.zone_sensible ) {
			this.orientation_x = -1;
		} else {
			this.orientation_x = 0;
		}

		// on Y
		if ( mouse_y < this.zone_sensible ) {
			this.orientation_y = 1;
		} else if  ( mouse_y > this.el.height() - this.zone_sensible ) {
			this.orientation_y = -1;
		} else {
			this.orientation_y = 0;
		}

		// Ask MVMT
		if ( this.mvmt_interval === null && (this.orientation_x !== 0 || this.orientation_y !== 0) ) {

			// Set the interval
			this.mvmt_interval = setInterval($.proxy(this, 'borderInterval'), 50);
		}
	},

	/**
	 * Interval method to update the position of maps
	 * 
	 * @return void
	 */
	this.borderInterval = function () {

		// Get the new speed
		this.speed_x = this.speed_x + (this.orientation_x - this.speed_x) / 5;
		this.speed_y = this.speed_y + (this.orientation_y - this.speed_y) / 5;

		var on_x = Math.ceil( this.speed_x * this.speed_ratio );
		var on_y = Math.ceil( this.speed_y * this.speed_ratio );

		// If the movement speed is less then 3 pixel on
		// each axis, we stop the movement
		if ( on_x < 3  &&  on_y < 3 && on_x > -3  &&  on_y > -3 ) {

			// Case to stop mvmt
			clearInterval(this.mvmt_interval);
			this.mvmt_interval = null;
		}
		else {

			// Update position
			this.moveMap(on_x, on_y);
		}
	},


	/* Events: Drag mode *****************************************************/

	/**
	 * Start dragging
	 * 
	 * @param	event object	e
	 * @return	void
	 */
	this.startDrag = function (e) {
		e.stopPropagation();
		e.cancelBubble = true;
		switch (e.type) {
			case 'mousedown':
				this.drag_point_x = e.clientX;
				this.drag_point_y = e.clientY;
				this.el.bind('mousemove',	$.proxy(this, 'mvmtDrag'));
				break;

			case 'touchstart':
				this.el.bind('touchmove',	$.proxy(this, 'mvmtDrag'));
				break;
		}
	},

	/**
	 * MVMT dragging
	 * 
	 * @param	event object	e
	 * @return	void
	 */
	this.mvmtDrag = function (e) {
		e.stopPropagation();
		e.cancelBubble = true;
		switch (e.type) {
			case 'mousemove':
				this.moveMap(e.clientX - this.drag_point_x, e.clientY - this.drag_point_y);
				this.drag_point_x = e.clientX;
				this.drag_point_y = e.clientY;
				break;

			case 'touchmove':
				break;
		}
	},

	/**
	 * Stop dragging
	 * 
	 * @param	event object	e
	 * @return	void
	 */
	this.stopDrag = function (e) {
		switch (e.type) {
			case 'mouseup':
				this.el.unbind('mousemove');
				break;

			case 'mouseout':
			console.log(e);
				// console.log($(e.relatedTarget).parent(this.el));
				if (e.which == 1)
					this.el.unbind('mousemove');
				break;

			case 'touchend':
				this.el.unnind('touchmove');
				break;
		}
	},


	/* Dev *******************************************************************/

	/**
	 * Custom log
	 *
	 * @param	string	message		Message to display in the log
	 * @return	void
	 */
	this.log = function (message) {
		if (this.options.dev)
			console.log('wallery log: ' + message);
	},

	// Initiate the object
	this.init(settings);
};