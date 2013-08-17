<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" dir="ltr" lang="en">
<head>

	<!-- Meta -->
	<title>wallery zero.one</title>
	<meta name="description" content="This script generate a wall of pictures with random positions. Move your mouse to navigate." />
	<link rel="image_src" href="/media/wallery/css/midget.jpg"> 
	
	<!-- Script JS -->
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/wallery.jQuery.js"></script>
	<script type="text/javascript" src="js/facebox.js"></script>
	<script type="text/javascript" src="js/wallery.js"></script>
	<script type="text/javascript" src="js/script.js"></script>
	
	
	<!-- Styles CSS -->
	<link rel="stylesheet" href="css/facebox.css" type="text/css" />
	<link rel="stylesheet" href="css/style.css" type="text/css" />
	<style rel="stylesheet" type="text/css" >
		.map {
			width: 	<?=$wllr_config['map_width'];  ?>px;
			height: <?=$wllr_config['map_height']; ?>px;
		}
	</style>
	
</head>
<body>
	
	<!-- Intro divs -->
	<div id="intro">
		<p id="intro_title">welcome in the wallery.</p>
		<p id="intro_desc">
			this script generate a wall of pictures with random positions.<br/>
			move your drag the wall to navigate.<br/>
			Wait the complete loading of the page before enter.<br/>
			We recommand to use Safari, Firefox or Chrome.<br/>
			Actually anything than Internet Explorer<br/>
			<u>click to enter</u>
		</p>
	</div>
	
	<!-- Wallery div -->
	<div id="wallery">
		<div class="map map0"><?=$wllr->rendering(true); ?></div>
		<div class="map map1"><?=$wllr->rendering(true); ?></div>
		<div class="map map2"><?=$wllr->rendering(true); ?></div>
		<div class="map map3"><?=$wllr->rendering(true); ?></div>		
	</div>
	
	<div id="warning">Your window is too big for us, sorry.<br>Please reduce the size of your browser.</div>

</body>
</html>
