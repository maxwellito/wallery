<?php

/* wallery 0.2
 *
 * This script is an exemple of what we can do with Wallery
 * Here, we generate 4 map of 3000x2000 px 
 * And we move them to give an illusion of an infinite wall
 * 
 *
 * This exemple use 'facebox' as lightBox and jQuery
 * Facebox, by defunkt (Chris Wanstrath)
 * https://github.com/defunkt/facebox
 *
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

// Includes
// Classes
include("../src/lib/map.php");
include("../src/lib/image.php");
include("../src/lib/album.php");
include("../src/lib/wallery.php");

// Le data (contains the picture database)
include("../src/data/data.php");

// Params
$wllr_config = array (
	'unite' 		=> 100,				// Size of a block
	'map_width' 	=> 3000,			// Width of a map
	'map_height' 	=> 2000,			// Height of a map
	'data'			=> $wallery_data	// Wallery data
);

// Code
$wllr = new Wallery ();	
$wllr->initialisation( $wllr_config );

// Make the view
include("../src/views/layout.php");