/**
 * Main script of the Wallery demo page
 * 
 */

// Create global objects
var myWallery = '#wallery';

// Event to call the start function
$(document).ready(function(){

	// Display the intro
	$("#intro")
		.delay(400)
		.slideDown("normal")
		.click( function(){
			$("#intro")
				.slideUp("normal")
				.delay(400)
				.queue(function() {
					$(myWallery).wallery({	navigation:	'drag',
											dev:		true,
											intro:		true,
											click:		function(e){console.log('wallery: click');} });
				});
		});

	// $('a[rel*=facebox]').facebox();
});