<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" dir="ltr" lang="en">
<head>

	<!-- Meta -->
	<title>wallery zero.one</title>
	<meta name="description" content="This script generate a wall of pictures with random positions. Move your mouse to navigate." />
	<link rel="image_src" href="/media/wallery/css/midget.jpg"> 
	
	<!-- Script JS -->
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/underscore-min.js"></script>
	<script type="text/javascript" src="js/wallery.jQuery.js"></script>
	<script type="text/javascript" src="js/facebox.js"></script>
	<script type="text/javascript" src="js/wallery.js"></script>
	<script type="text/javascript" src="js/script.js"></script>
	
	<script type="text/javascript" src="js/WalleryBuilder.js?t=<?=$_SERVER['REQUEST_TIME'];?>"></script>
	<script type="text/javascript" src="js/WalleryMap.js?t=<?=$_SERVER['REQUEST_TIME'];?>"></script>
	<script type="text/javascript" src="js/WalleryAlbum.js?t=<?=$_SERVER['REQUEST_TIME'];?>"></script>
	<script type="text/javascript" src="js/WalleryItem.js?t=<?=$_SERVER['REQUEST_TIME'];?>"></script>

	<script type="text/template" id="template_wallery_item">
		<div class='imgContainer' style='
			left: <%=place.posX %>px;	top: <%=place.posY %>px;
			width: <%=place.width %>px;	height:<%=place.height %>px;
			background-image: url(<%=data.pictureSrc %>);
			background-position: -<%=item.posX %>px -<%=item.posY %>px; display:none;' >
		</div>
	</script>

	<script type="text/javascript">
		wallData = [	
			[430, 	156, 	{pictureSrc: "data/1_X.png",  link: "http://maxwellito.com/media/maxwellito_v1/data/2010_01_01_maxwellito/_main.png"}],
			[431, 	119, 	{pictureSrc: "data/2_1.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_06_07_freedomRecordTheme/_main.jpg"}],
			[200, 	323, 	{pictureSrc: "data/2_2.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_06_07_freedomRecordTheme/_main.jpg"}],
			[314, 	112, 	{pictureSrc: "data/3_1.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_01_01_jpsauvaire/ss_001.jpg"}],
			[133, 	343, 	{pictureSrc: "data/3_2.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_01_01_jpsauvaire/ss_001.jpg"}],
			[258, 	270, 	{pictureSrc: "data/3_3.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_01_01_jpsauvaire/ss_001.jpg"}],
			[130, 	118, 	{pictureSrc: "data/4_1.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2008_09_01_macOStouch/_main.jpg"}],
			[324, 	125, 	{pictureSrc: "data/4_2.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2008_09_01_macOStouch/ss_001.jpg"}],
			[103, 	239, 	{pictureSrc: "data/4_3.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2008_09_01_macOStouch/ss_002.jpg"}],
			[225, 	220, 	{pictureSrc: "data/4_4.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2008_09_01_macOStouch/ss_003.jpg"}],
			[229, 	105, 	{pictureSrc: "data/4_5.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2008_09_01_macOStouch/ss_004.jpg"}],
			[106, 	105, 	{pictureSrc: "data/5_1.png",  link: "http://maxwellito.com/media/maxwellito_v1/data/2008_05_09_daftPunkTab/_main.png"}],
			[108, 	104, 	{pictureSrc: "data/5_2.png",  link: "http://maxwellito.com/media/maxwellito_v1/data/2008_05_09_daftPunkTab/_main.png"}],
			[420, 	107, 	{pictureSrc: "data/5_3.png",  link: "http://maxwellito.com/media/maxwellito_v1/data/2008_05_09_daftPunkTab/_main.png"}],
			[600, 	148, 	{pictureSrc: "data/6_1.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_03_15_toulouse/ss_001.jpg"}],
			[212, 	342, 	{pictureSrc: "data/6_2.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_03_15_toulouse/ss_002.jpg"}],
			[200, 	204, 	{pictureSrc: "data/6_3.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_03_15_toulouse/ss_003.jpg"}],
			[102, 	207, 	{pictureSrc: "data/6_4.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_03_15_toulouse/ss_004.jpg"}],
			[102, 	302, 	{pictureSrc: "data/6_5.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_03_15_toulouse/ss_005.jpg"}],
			[103, 	103, 	{pictureSrc: "data/6_6.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_03_15_toulouse/ss_006.jpg"}],
			[218, 	219, 	{pictureSrc: "data/7_1.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_02_22_spaceInvaders/ss_001.jpg"}],
			[222, 	224, 	{pictureSrc: "data/7_2.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_02_22_spaceInvaders/ss_002.jpg"}],
			[350, 	202, 	{pictureSrc: "data/7_3.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2009_02_22_spaceInvaders/ss_003.jpg"}],
			[447, 	184, 	{pictureSrc: "data/8_1.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2007_04_13_paperMac/ss_001.jpg"}],
			[110, 	110, 	{pictureSrc: "data/8_2.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2007_04_13_paperMac/ss_002.jpg"}],
			[120, 	220, 	{pictureSrc: "data/8_3.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2007_04_13_paperMac/ss_003.jpg"}],
			[110, 	110, 	{pictureSrc: "data/8_4.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2007_04_13_paperMac/ss_004.jpg"}],
			[240, 	240, 	{pictureSrc: "data/9_1.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2007_01_01_oldShoots/ss_001.jpg"}],
			[420, 	222, 	{pictureSrc: "data/9_2.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2007_01_01_oldShoots/ss_002.jpg"}],
			[120, 	120, 	{pictureSrc: "data/9_4.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2007_01_01_oldShoots/ss_004.jpg"}],
			[220, 	220, 	{pictureSrc: "data/9_5.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2007_01_01_oldShoots/ss_005.jpg"}],
			[300, 	206, 	{pictureSrc: "data/9_6.jpg",  link: "http://maxwellito.com/media/maxwellito_v1/data/2007_01_01_oldShoots/ss_006.jpg"}],
			[400, 	168, 	{pictureSrc: "data/10_1.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_11_30_freedomRecordStickers/ss_002.jpg"}],
			[116, 	210, 	{pictureSrc: "data/11_1.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2007_07_12_theHorrorShow/ss_001.jpg"}],
			[210, 	210, 	{pictureSrc: "data/11_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2007_07_12_theHorrorShow/ss_002.jpg"}],
			[210, 	110, 	{pictureSrc: "data/11_3.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2007_07_12_theHorrorShow/ss_003.jpg"}],
			[110, 	210, 	{pictureSrc: "data/12_1.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2007_12_02_mario/ss_001.jpg"}],
			[210, 	110, 	{pictureSrc: "data/12_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2007_12_02_mario/ss_002.jpg"}],
			[135, 	135, 	{pictureSrc: "data/12_3.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2007_12_02_mario/ss_003.jpg"}],
			[200, 	430, 	{pictureSrc: "data/13_1.png", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_10_27_asteroids/ss_001.jpg"}],
			[274, 	274, 	{pictureSrc: "data/13_2.png", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_10_27_asteroids/ss_002.png"}],
			[221, 	232, 	{pictureSrc: "data/14_1.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_10_01_autumn09/ss_001.jpg"}],
			[300, 	133, 	{pictureSrc: "data/14_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_10_01_autumn09/ss_002.jpg"}],
			[110, 	110, 	{pictureSrc: "data/14_3.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_10_01_autumn09/ss_003.jpg"}],
			[110, 	110, 	{pictureSrc: "data/14_4.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_10_01_autumn09/ss_004.jpg"}],
			[320, 	110, 	{pictureSrc: "data/14_5.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_10_01_autumn09/ss_005.jpg"}],
			[150, 	150, 	{pictureSrc: "data/14_6.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_10_01_autumn09/ss_006.jpg"}],
			[220, 	100, 	{pictureSrc: "data/15_1.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_05_02_requiescatInPace/ss_001.jpg"}],
			[285, 	400, 	{pictureSrc: "data/15_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_05_02_requiescatInPace/ss_002.jpg"}],
			[380, 	258, 	{pictureSrc: "data/15_3.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_05_02_requiescatInPace/ss_003.jpg"}],
			[180, 	120, 	{pictureSrc: "data/16_X.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_06_08_skateboard/_main.jpg"}],
			[110, 	335, 	{pictureSrc: "data/16_1.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_06_08_skateboard/ss_001.jpg"}],
			[133, 	200, 	{pictureSrc: "data/16_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2009_06_08_skateboard/ss_002.jpg"}],
			[280, 	177, 	{pictureSrc: "data/17_1.png", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_05_05_typoworks/ss_001.png"}],
			[180, 	270, 	{pictureSrc: "data/17_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_05_05_typoworks/ss_002.jpg"}],
			[467, 	140, 	{pictureSrc: "data/18_X.png", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_07_05_edBangerXXgorillaz/ss_001.png"}],
			[129, 	113, 	{pictureSrc: "data/18_1.png", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_07_05_edBangerXXgorillaz/ss_001.png"}],
			[119, 	302, 	{pictureSrc: "data/18_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_07_05_edBangerXXgorillaz/ss_002.jpg"}],
			[252, 	250, 	{pictureSrc: "data/18_3.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_07_05_edBangerXXgorillaz/ss_003.jpg"}],
			[176, 	100, 	{pictureSrc: "data/18_4.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_07_05_edBangerXXgorillaz/ss_004.jpg"}],
			[120, 	220, 	{pictureSrc: "data/18_5.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_07_05_edBangerXXgorillaz/ss_005.jpg"}],
			[215, 	215, 	{pictureSrc: "data/18_6.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_07_05_edBangerXXgorillaz/ss_006.jpg"}],
			[280, 	285, 	{pictureSrc: "data/19_X.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_08_15_itWasMadeFor/_main.jpg"}],
			[320, 	140, 	{pictureSrc: "data/19_1.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_08_15_itWasMadeFor/ss_001.jpg"}],
			[150, 	250, 	{pictureSrc: "data/19_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_08_15_itWasMadeFor/ss_002.jpg"}],
			[150, 	150, 	{pictureSrc: "data/19_3.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_08_15_itWasMadeFor/ss_003.jpg"}],
			[158, 	120, 	{pictureSrc: "data/19_4.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_08_15_itWasMadeFor/ss_004.jpg"}],
			[200, 	300, 	{pictureSrc: "data/20_1.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_09_20_sponge_bob/ss_001.jpg"}],
			[279, 	200, 	{pictureSrc: "data/20_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_09_20_sponge_bob/ss_002.jpg"}],
			[295, 	200, 	{pictureSrc: "data/20_3.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_09_20_sponge_bob/ss_003.jpg"}],
			[280, 	187, 	{pictureSrc: "data/20_4.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_09_20_sponge_bob/ss_004.jpg"}],
			[350, 	350, 	{pictureSrc: "data/21_1.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_11_05_lomography/ss_001.jpg"}],
			[319, 	280, 	{pictureSrc: "data/21_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_11_05_lomography/ss_002.jpg"}],
			[281, 	300, 	{pictureSrc: "data/21_3.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_11_05_lomography/ss_003.jpg"}],
			[250, 	250, 	{pictureSrc: "data/21_4.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_11_05_lomography/ss_004.jpg"}],
			[172, 	200, 	{pictureSrc: "data/21_6.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_11_05_lomography/ss_006.jpg"}],
			[220, 	220, 	{pictureSrc: "data/21_7.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_11_05_lomography/ss_007.jpg"}],
			[180, 	120, 	{pictureSrc: "data/21_8.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_11_05_lomography/ss_008.jpg"}],
			[120, 	116, 	{pictureSrc: "data/22_1.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_12_22_getyourfifteen/ss_001.jpg"}], 
			[195, 	261, 	{pictureSrc: "data/22_2.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_12_22_getyourfifteen/ss_001.jpg"}],
			[322, 	280, 	{pictureSrc: "data/22_3.jpg", link: "http://maxwellito.com/media/maxwellito_v1/data/2010_12_22_getyourfifteen/ss_001.jpg"}]
		];

		//wallData = <?=json_encode($wallery_data); ?>;
		var pizza = new WalleryBuilder( {	unite: 50, 
											mapWidth: 3000, 
											mapHeight: 2000 });
		pizza.addStack(wallData);
		pizza.generate();
		console.log(
		pizza.map.rendering(function(data){

			var tpl = _.template( $('#template_wallery_item').html() );
			return tpl(data);

		}));
	</script>

	

	
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
