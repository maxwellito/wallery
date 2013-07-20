/**
 * Main script of the Wallery demo page
 * 
 */

// Create global objects
var myWallery;
var myWallerySettings = {el: '#wallery'};

// Event to call the start function
$(document).ready(function(){

	// Display the intro
	$("#intro, #intro_info")
		.delay(400)
		.slideDown("normal")
		.click( function(){
			$("#intro, #intro_info")
				.slideUp("normal")
				.delay(400)
				.queue(function() {
					myWallery.start();
				});
		});

	myWallery = new Wallery(myWallerySettings);
	$('a[rel*=facebox]').facebox();
});