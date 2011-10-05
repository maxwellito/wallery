/*
 * Wallery
 * version: 0.1 (20/01/2011)
 * @requires jQuery v1.2 or later
 * @requires custom facebox
 *
 * Copyright 2011 Maxwellito (maxwellito.com)
 *
 */

var time_start = 1000;			// Time before animation start

var map_width = 0;				// Map element properties
var map_height = 0;

var img_mw;						// lightbox max_width
var img_mh;						// lightbox max_height

var speed_x = 0.0;				// Current speed
var speed_y = 0.0;
var new_speed_x = 0.0;			// New speed to get
var new_speed_y = 0.0;

var speed_ratio = 50;			// Max speed (px)

var zone_sensible;				// Sensitive border for MVMT

var on_warning = false;
var on_mvmt = false;
var mvmt_allowed = true;

var position = [[0, 1],
				[2, 3]];


// Event to call the start function
$(document).ready(function(){
	start();
	$('a[rel*=facebox]').facebox()
});

// Start function
function start () {

	// Init map size
	map_width = $("#map0").width();
	map_height = $("#map0").height();

	// Show intro
	setTimeout( function(){
		$("#intro").slideDown("normal");
		$("#intro_info").slideDown("normal");
	}, 400);
	
	// Click event to continue
	if ($("#map0").size() != 0) {
		$("#intro").click( function(){
			start_navigation();
		});
	}
	
	update_zone_sensible ()
}

// Start navigation
function start_navigation () {

	// Hide intro
	$("#intro").slideUp("normal");
	$("#intro_info").slideUp("normal");
	
	// Start all boxes
	$(".img_container").each( function(){
		show_on ( this, Math.round(Math.random()*10)*200 + time_start );
	});
	
	// Listening mouse MVMT
	$(document).mousemove( function(e) { 
		update_speed(e.pageX, e.pageY); 	
	});
}

// Function to display images
function show_on ( pElement, pTime ) {

	if (pTime != 0) {
		setTimeout( function(){
			show_on ( pElement, 0 );
		}, pTime);
	}
	else {
		$(pElement).css("background-color","white");
		$(pElement).children("a").children("img").fadeIn("normal");
	}
}


// Navigation part
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Security
////////////////////////////////////////////////////////////////////////////////

// Check window size
$(window).resize( function() { 	
	// if the window size is higher than the map size : STOP
	if ( !on_warning && ($(window).width() > map_width || $(window).height() > map_height) ) {
		// lock_screen
		$(".map").hide("normal");
		$("#warning").show("slow");
		on_warning = true;
	} 
	else if ( on_warning && $(window).width() < map_width && $(window).height() < map_height ) {
		// unlock_screen
		$(".map").show("slow");
		$("#warning").hide("normal");
		on_warning = false;
	}
	
	// update elements
	update_zone_sensible();
});

// Update elements about size of the window
function update_zone_sensible () {
	zone_sensible = $(window).width() * $(window).height() / 7500;
	img_mw = $(window).width() * 0.9;
	img_mh = $(window).height() * 0.9;
}



// MVMT
////////////////////////////////////////////////////////////////////////////////

// Update speed
function update_speed (mouse_x, mouse_y) {
	
	if ( !mvmt_allowed )
		return 0;
	
	// on X
	if ( mouse_x < zone_sensible ) {
		new_speed_x = 1;
	} else if  ( mouse_x > $(window).width() - zone_sensible ) {
		new_speed_x = -1;
	} else {
		new_speed_x = 0;
	}

	// on Y
	if ( mouse_y < zone_sensible ) {
		new_speed_y = 1;
	} else if  ( mouse_y > $(window).height() - zone_sensible ) {
		new_speed_y = -1;
	} else {
		new_speed_y = 0;
	}
	
	// Ask MVMT
	if ( !on_mvmt && (new_speed_x != 0 || new_speed_y != 0) ) {
		
		// Call the function it's not running
		if ( !on_mvmt ) 
			move_map ();
		
		// Pass to the state 'on_mvmt'
		on_mvmt = true;
	}
}

// Function to update the position of maps
function move_map () {
	
	// Get the new speed
	speed_x = speed_x + (new_speed_x - speed_x) / 5;
	speed_y = speed_y + (new_speed_y - speed_y) / 5;
	
	var on_x = Math.ceil( speed_x * speed_ratio );
	var on_y = Math.ceil( speed_y * speed_ratio );
	
	if ( on_x < 3  &&  on_y < 3 && on_x > -3  &&  on_y > -3 ) {
		
		// Case to stop mvmt
		on_mvmt = false;
	}
	else {
		
		// Update current_map
		var current_x = parseInt($("#map"+position[0][0]).css("left")) + on_x;
		var current_y = parseInt($("#map"+position[0][0]).css("top")) + on_y;
		
		// Update positions on Y //////////////////////////
		// top
		if ( current_y > 0 ) { 
			
			current_y -= map_height;
			position = [[position[1][0], position[1][1]],
						[position[0][0], position[0][1]]];
		}
		
		// bottom
		else if ( current_y < - map_height ) { 
			
			current_y += map_height;
			position = [[position[1][0], position[1][1]],
						[position[0][0], position[0][1]]];
		}
		
		// Update positions on X //////////////////////////
		// left
		if ( current_x > 0 ) { 
			
			current_x -= map_width;
			position = [[position[0][1], position[0][0]],
						[position[1][1], position[1][0]]];
		}
		// right
		else if ( current_x < - map_width ) { 
			
			current_x += map_width;
			position = [[position[0][1], position[0][0]],
						[position[1][1], position[1][0]]];
		}
		
		// Update maps positions
		$( "#map"+position[0][0] ).css("left", current_x + "px");
		$( "#map"+position[0][0] ).css("top", current_y + "px");
		
		$( "#map"+position[0][1] ).css("left", (current_x + map_width) + "px");
		$( "#map"+position[0][1] ).css("top", current_y + "px");
		
		$( "#map"+position[1][0] ).css("left", current_x + "px");
		$( "#map"+position[1][0] ).css("top", (current_y + map_height) + "px");
		
		$( "#map"+position[1][1] ).css("left", (current_x + map_width) + "px");
		$( "#map"+position[1][1] ).css("top", (current_y + map_height) + "px");
		
		// Call for the next update
		setTimeout( function(){
			move_map();
		}, 50);
		
	}
}



// CTRL
////////////////////////////////////////////////////////////////////////////////

// Stop navigation (used with the lightbox)
function stop_navigation () {
	
	mvmt_allowed = false;
	
	// Stop the mouvement
	new_speed_x = 0;
	new_speed_y = 0;
}

// Play navigation (used with the lightbox)
function play_navigation () {
	
	mvmt_allowed = true;
}