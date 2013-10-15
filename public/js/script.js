/**
 * Main script of the Wallery demo page
 * 
 */

/* Create global objects
 */
var myWallery		= '#wallery';
var myWalleryUnit	= 100;
var myWalleryWidth	= 3000;
var myWalleryHeight = 2000;


/**
 * Template for item rendering
 * @param	Object	data	Template data object 
 * @return	String			HTML code
 */
function walleryItemTemplatr (data){
	var tpl = _.template( $('#template_wallery_item').html() );
	return tpl(data);
}


/* Event to call the start function
 * Main script
 */
$(document).ready(function(){

	/** 
	 * Part 1 : Generate the map
	 * 
	 */
	var myWall = new WalleryBuilder( {	unit:		myWalleryUnit,
										mapWidth:	myWalleryWidth,
										mapHeight:	myWalleryHeight });
	// Insert all the data
	myWall.addStack(wallData);

	for(var i = 0; i<4; i++) {

		// Generate a new wall
		myWall.generate();

		// Create the tag and set it in the wallery dom
		$('<div></div>')
			.addClass('map')
			.addClass('map'+i)
			.width(myWalleryWidth)
			.height(myWalleryHeight)
			.html(myWall.rendering(walleryItemTemplatr))
			.appendTo(myWallery);
	}

	/** 
	 * Part 2 : Set up the jQuery instance
	 * Display the intro
	 * Of course all of this is useless, it's only for a nice demo page
	 */
	$("#intro")
		.delay(400)
		.slideDown("normal")
		.click( function(){
			$("#intro")
				.slideUp("normal")
				.delay(400)
				.queue(function() {
					$(myWallery).wallery({	navigation:	'border',
											dev:		true,
											intro:		true,
											click:		function(e){console.log('wallery: click');} });
				});
		});
});