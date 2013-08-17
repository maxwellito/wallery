/**
 * Wallery class
 * This class content all the informations and algorithms about a wall
 *
 * WARNING :
 * The image database need an image with the dimensions of 1x1 unit
 *
 * @param	Array	settings 
 *				int		'unite'			Bloc size in pixel
 *				int		'mapWidth'		Map width in pixel
 *				int		'mapHeight'		Map height in pixel
 *				array	'data'			Array of picture data (:src/data/data.php)
 */

WalleryBuilder = function (settings) {
	
	/* Variables *************************************************************/
		
	// Tests
	// Check if variables are set
	if (!isset(settings['unite'])		|| !isset(settings['data']) ||
		!isset(settings['mapWidth'])	|| !isset(settings['mapHeight']))
		return false; //# DEV: Throw error

	// Check if there's data
	if (!is_array(settings['data']) || count(settings['data'])===0)
		return false; //# DEV: Throw error
	
	// Check unite and border
	if (settings['unite'] <= 0)
		return false; //# DEV: Throw error
	
	// Check the map size
	if (settings['unite'] > settings['mapWidth'] || settings['unite'] > settings['mapHeight'])
		return false; //# DEV: Throw error
		
	// Everything is OK
	this.imagesBase			= settings['data'];
	this.unite				= settings['unite'];
	this.mapWidthPx			= settings['mapWidth'];
	this.mapHeightPx		= settings['mapHeight'];
	this.border				= 2; //# TO_REMOVE
	
	this.isGenerated		= false;

	this.marge				= 0;	// % of free space in the generated map
	this.nbRandTentatives	= 5;	// Number of try to find a place
	
	// Map creation
	var mapWidthUnit		= ceil( settings['mapWidth'] /this.unite );
	var mapHeightUnit		= ceil( settings['mapHeight']/this.unite );

	this.map = new WalleryMap ();
	this.map.initialisation( this.unite, mapWidthUnit, mapHeightUnit );
	
	return true;
};
	
/**
 * Setter for the try level
 * 
 * @param	Int		level		New motel level value to set
 */
WalleryBuilder.prototype.setMotorLevel = function (level) {
	
	if (level >= 0) {
		this.nbRandTentatives = level;
		return true;
	} else {
		return false;
	}
};
	
/**
 * Setter for the percent of free space in the generated final map
 * 
 * @param	Int		ffs		New final free space value to set
 */
WalleryBuilder.prototype.setFinalFreeSpace = function (ffs) {
	
	if (ffs >= 0 && ffs <= 100) {
		this.marge = ffs;
		return true;
	} else {
		return false;
	}
};

/**
 * Rendering of the wall
 * @param	boolean	generate	Force to generate a new wall
 * @return	String				Rendered code
 */
WalleryBuilder.prototype.rendering = function (generate) {

	if (generate === true || !this.isGenerated)
		this.generate();

	return this.map.rendering( this.border );
};


/* Engine ****************************************************************/

/**
 * Generate a wall
 * @return void
 */
WalleryBuilder.prototype.generate = function () {

	var i, j, isPlaced, currentImg, nbTry, positionStart;
	var theOne, positionToTry, lastChance, limitFreeSpace, imageDisplayed;

	// Treatement of images and fill the Album
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	var album = new WalleryAlbum();
	album.initialisation( this.unite );
	
	var image, imageSrc;
	for (var imageSrcIndex in this.imagesBase) {
		
		// Creation of the object Image and adding in the Album
		imageSrc = this.imagesBase[imageSrcIndex];
		image = new WalleryImage();
		if (image.initialisation( imageSrc[0], imageSrc[1], imageSrc[2], imageSrc[3] ))
			album.addImage(image);
	}
	
	// Sort the album (descending)
	album.sortIt();
	
	
	// Get the number of displaying of each image
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	
	var nb_aff = ceil( this.map.size * ((this.unite - this.marge) / this.unite) / album.size ) - 1;
	
	for (i in album.portfolio.length) {
		album.portfolio[i].use_count = nb_aff;
	}
	
	
	// We begin to put image in the map
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	
	// Premier traitement
	for (i in album.portfolio.length) {
		
		// Get the image to put
		currentImg = album.portfolio[i];
		
		// Number of try (for the random solution)
		nbTry = currentImg.use_count;
		
		while (currentImg.use_count !== 0) {
			
			// Random test to find a place on the map
			isPlaced = false;
			
			while ( !isPlaced && (nbTry > 0) ) {
				
				nbTry--;
				positionToTry = this.map.getRandomPlace( currentImg.width_unit, currentImg.height_unit );
				isPlaced = this.map.placeCheck(	positionToTry['x'],
												positionToTry['y'],
												currentImg.width_unit,
												currentImg.height_unit);
			}
			
			// If place has been find we put the image
			// Else we try manually (but it need more ressources and time)
			if (isPlaced) {
				
				this.map.putImage(	currentImg,
									positionToTry['x'],
									positionToTry['y'],
									currentImg.width_unit,
									currentImg.height_unit );
				
			} else {
			
				// In this case the random case hasn't been nice with us
				// => We gonna find a place manually
				lastChance = this.map.findPlace( currentImg.width_unit, currentImg.height_unit );
				
				if (lastChance) {
				
					theOne = rand(0, count(lastChance)-1);
					this.map.putImage(	currentImg,
										lastChance[theOne]['x'],
										lastChance[theOne]['y'],
										currentImg.width_unit,
										currentImg.height_unit);
										
				} else {
				
					currentImg.use_count = 0;
				}
			}
		}
	}
	
	
	// Basically, we just have to fill the blank
	positionStart	= 0;
	limitFreeSpace	= ceil(this.map.size * (this.marge/this.unite));
	i				= 0;
	
	while ( this.map.free_space >= limitFreeSpace  &&  positionStart < count(album.portfolio) ) {
		
		// Récupération de l'image a placer
		currentImg = album.portfolio[i];
		
		// In this case the random case hasn't been nice with us
		// => We gonna find a place manually
		lastChance = this.map.findPlace( currentImg.width_unit, currentImg.height_unit );
		
		if (lastChance) {
		
			theOne = rand(0, count(lastChance)-1);
			
			// Random funtion
			imageDisplayed = album.portfolio[rand(0, i)];
			while (imageDisplayed.width_unit < currentImg.width_unit || imageDisplayed.height_unit < currentImg.height_unit) {
				imageDisplayed = album.portfolio[rand(0, i)];
			}
			
			this.map.putImage(	imageDisplayed,
								lastChance[theOne]['x'],
								lastChance[theOne]['y'],
								currentImg.width_unit,
								currentImg.height_unit);
		} else {
		
			positionStart = i + 1;
		}
		
		if ( i + 1 == count(album.portfolio) ) {
			i = positionStart;
		} else {
			i++;
		}
	}
	
	// Final step
	this.isGenerated = true;
};