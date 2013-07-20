/**
 * Wallery class
 * Javascript class to control the 4 maps
 * and simulate the wallery
 * 
 *
 */

var Wallery = function (settings)
{
	
	/* jQuery object of the wallery DOM element
	 *
	 * @var		jQuery object
	 */
	this.el;

	/* Map size variables (in pixels)
	 *
	 * @var		int
	 */
	this.map_width		= 0;
	this.map_height		= 0;

	/* Speed variables
	 *
	 * @var		Object
	 */
	this.speed_x		= 0.0;				// Current speed
	this.speed_y		= 0.0;
	this.new_speed_x	= 0.0;			// New speed to get
	this.new_speed_y	= 0.0;
	this.speed_ratio	= 50;			// Max speed (px)

	/* Model of the object
	 *
	 * @var		Object
	 */
	this.zone_sensible;				// Sensitive border for MVMT

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
	this.position;
	
	

	/** 
	 * Initialisation method
	 * Keep params from the model object
	 *
	 * settings :
	 * 		el(string)	jQuery selector for the wallery DOM object
	 * 		
	 * @param	object	settings	Params to set the object
	 * @return  void	
	 */
	this.init = function (settings) {

		// Param tests
		if (settings['el'] === undefined)
			return;

		this.el = $(settings['el']);

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

	}


	/* Interface *************************************************************/
	
	/**
	 * Start navigation
	 * 
	 * @return void
	 */
	this.start = function () {

		// Start the intro animation
		// : pop effect on each picture
		$(".img_container").each( function(){
			$(this)	
				.delay( Math.round(Math.random()*10)*200 )
				.queue( function() {
					$(this)	
						.css("background-color","#FFF")
						.children("a").children("img").fadeIn("normal");
				});	
		});

		// Update interaction zone
		this.updateZoneSensible();
		
		// Listen mouse MVMT
		this.el.mousemove($.proxy(this, 'updateSpeed'));

		// Listen window 
		this.el.resize($.proxy(this, 'windowCheck'));
	}

	/**
	 * Play navigation
	 * method to enable the navigation
	 * 
	 * @return void
	 */
	this.playNavigation = function () {
		
		this.mvmt_allowed = true;
	}

	/**
	 * Stop navigation
	 * method to disable the navigation
	 * 
	 * @return void
	 */
	this.stopNavigation = function () {
		
		// Stop the mouvement
		this.mvmt_allowed	= false;
		this.new_speed_x	= 0;
		this.new_speed_y	= 0;
	}


	/* Engine ****************************************************************/

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
	}

	/**
	 * Update elements about size of the window
	 * 
	 * @return void
	 */
	this.updateZoneSensible = function () {
		this.zone_sensible = this.el.width() * this.el.height() / 7500;
	}

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
			this.new_speed_x = 1;
		} else if  ( mouse_x > this.el.width() - this.zone_sensible ) {
			this.new_speed_x = -1;
		} else {
			this.new_speed_x = 0;
		}

		// on Y
		if ( mouse_y < this.zone_sensible ) {
			this.new_speed_y = 1;
		} else if  ( mouse_y > this.el.height() - this.zone_sensible ) {
			this.new_speed_y = -1;
		} else {
			this.new_speed_y = 0;
		}
		
		// Ask MVMT
		if ( this.mvmt_interval == null && (this.new_speed_x != 0 || this.new_speed_y != 0) ) {
			
			// Set the interval
			this.mvmt_interval = setInterval($.proxy(this, 'moveMap'), 50);
		}
	}

	/**
	 * Interval method to update the position of maps
	 * 
	 * @return void
	 */
	this.moveMap = function () {
		
		// Get the new speed
		this.speed_x = this.speed_x + (this.new_speed_x - this.speed_x) / 5;
		this.speed_y = this.speed_y + (this.new_speed_y - this.speed_y) / 5;
		
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
			
			// Get the new map position
			var position	= this.position;
			var current_x	= parseInt(position[0][0].css("left")) + on_x;
			var current_y	= parseInt(position[0][0].css("top"))  + on_y;
			
			// Update positions on Y
			if ( current_y > 0 ) { 
				// Top case
				current_y -= this.map_height;
				this.position = [[position[1][0], position[1][1]],
								 [position[0][0], position[0][1]]];
			}
			else if ( current_y < -this.map_height ) { 
				// Bottom case
				current_y += this.map_height;
				this.position = [[position[1][0], position[1][1]],
								 [position[0][0], position[0][1]]];
			}
			
			// Update positions on X
			if ( current_x > 0 ) { 
				// Left case
				current_x -= this.map_width;
				this.position = [[position[0][1], position[0][0]],
								 [position[1][1], position[1][0]]];
			}
			else if ( current_x < - this.map_width ) { 
				// Right case
				current_x += this.map_width;
				this.position = [[position[0][1], position[0][0]],
								 [position[1][1], position[1][0]]];
			}
			
			// Update maps positions
			this.position[0][0].css({left: current_x + "px", top: current_y + "px"});
			this.position[0][1].css({left: (current_x + this.map_width) + "px", top: current_y + "px"});
			this.position[1][0].css({left: current_x + "px", top: (current_y + this.map_height) + "px"});
			this.position[1][1].css({left: (current_x + this.map_width) + "px", top: (current_y + this.map_height) + "px"});
		}
	}

	// Initiate the object
	this.init(settings)
}