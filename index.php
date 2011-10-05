<?php


/* galleryLoop 0.1
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


// Includes
// Classes
include("classes/map.php");
include("classes/image.php");
include("classes/album.php");
include("classes/wallery.php");

// Le data (contains the image database)
include("data_regular.php");

// Params
$c_unite 		= 100;		// Size of a block
$c_mapWidth 	= 3000;		// Width of a map
$c_mapHeight 	= 2000;		// Height of a map

// Code
$wllr = new Wallery ();	
$wllr->initialisation( $data_dev, $c_unite, $c_mapWidth, $c_mapHeight );


	


?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" dir="ltr" lang="en">

<head>

	<!-- Meta -->
	<title>wallery zero.one</title>
	<meta name="description" content="This script generate a wall of pictures with random positions. Move your mouse to navigate." />
	<link rel="image_src" href="/media/wallery/css/midget.jpg"> 
	
	<!-- Script JS -->
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/gallery_script.js"></script>
	<script type="text/javascript" src="js/facebox.js"></script>
	
	<!-- Styles CSS -->
	<link rel="stylesheet" href="css/style.css" type="text/css" />
	<link rel="stylesheet" href="css/facebox.css" type="text/css" />
	<style rel="stylesheet" type="text/css" >
		.map {
			width: <?=$c_mapWidth; ?>px;
			height: <?=$c_mapHeight; ?>px;
		}
	</style>
	
</head>
<body>
	
	<div id="intro">
		<p id="intro_title">welcome in the wallery.</p>
		<p id="intro_desc">this script generate a wall of pictures with random positions.<br/>
						move your mouse to navigate.<br/>
						<u>click to enter.</u></p>	
	</div>
	
	<div id="intro_info">
		Wait the complete loading of the page before enter.<br/>
		We recommand to use Safari, Firefox or Chrome.<br/>
		Sorry, it's not made for smartphones & tablets.
	</div>
	
	<div id="map0" class="map" style="top:0px; 					left:0px;					"><?=$wllr->generate(true); ?></div>
	<div id="map1" class="map" style="top:0px; 					left:<?=$c_mapWidth;?>px;	"><?=$wllr->generate(true); ?></div>
	<div id="map2" class="map" style="top:<?=$c_mapHeight;?>px; left:0px;					"><?=$wllr->generate(true); ?></div>
	<div id="map3" class="map" style="top:<?=$c_mapHeight;?>px; left:<?=$c_mapWidth;?>px;	"><?=$wllr->generate(true); ?></div>
	
	<div id="warning">Your window is too big for us, sorry.<br>Please reduce the size of your browser.</div>

</body>
</html>