<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" dir="ltr" lang="en">
<head>

	<!-- Meta -->
	<title>wallery zero.one</title>
	<meta name="description" content="This script generate a wall of pictures with random positions. Move your mouse to navigate." />
	<link rel="image_src" href="/media/wallery/css/midget.jpg"> 
	
	<!-- Script JS -->
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/facebox.js"></script>
	<script type="text/javascript" src="js/gallery_script.js"></script>
	
	
	<!-- Styles CSS -->
	<link rel="stylesheet" href="css/style.css" type="text/css" />
	<link rel="stylesheet" href="css/facebox.css" type="text/css" />
	<style rel="stylesheet" type="text/css" >
		.map {
			width: 	<?=$wllr_config['map_width'];  ?>px;
			height: <?=$wllr_config['map_height']; ?>px;
		}

		#map0 {
			top:	0px;
			left:	0px;
		}

		#map1 {
			top:	0px;
			left:	<?=$wllr_config['map_width'];?>px;
		}
		
		#map2 {
			top:	<?=$wllr_config['map_height'];?>px;
			left:	0px;
		}
		
		#map3 {
			top:	<?=$wllr_config['map_height'];?>px;
			left:	<?=$wllr_config['map_width'];?>px;
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
	
	<div id="map0" class="map"><?=$wllr->rendering(true); ?></div>
	<div id="map1" class="map"><?=$wllr->rendering(true); ?></div>
	<div id="map2" class="map"><?=$wllr->rendering(true); ?></div>
	<div id="map3" class="map"><?=$wllr->rendering(true); ?></div>
	
	<div id="warning">Your window is too big for us, sorry.<br>Please reduce the size of your browser.</div>

</body>
</html>
