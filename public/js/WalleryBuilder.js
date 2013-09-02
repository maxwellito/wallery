/**
 * Wallery class
 * This class content all the informations and algorithms about a wall
 *
 *
 * @param	Array	settings 
 *				int			'unite'			Bloc size in pixel
 *				int			'mapWidth'		Map width in pixel
 *				int			'mapHeight'		Map height in pixel
 *				boolean		'crop'			Allow to crop your item (default: true)
 *				function	'template'		Template function
 */

function WalleryBuilder (settings) {
	
	/* Variables *************************************************************/
		
	// Tests
	// Check if variables are set
	if (settings['unite'] === undefined		||
		settings['mapWidth'] === undefined	|| settings['mapHeight'] === undefined)
		return false; //# DEV: Throw error
	
	// Check unite and border
	if (settings['unite'] <= 0)
		return false; //# DEV: Throw error
	
	// Check the map size
	if (settings['unite'] > settings['mapWidth'] || settings['unite'] > settings['mapHeight'])
		return false; //# DEV: Throw error
		
	// Everything is OK
	this.unite				= settings['unite'];
	this.mapWidthPx			= settings['mapWidth'];
	this.mapHeightPx		= settings['mapHeight'];
	this.border				= 2; //# TO_REMOVE
	this.crop				= settings['crop'] !== undefined ? settings['crop'] : true;
	
	this.isGenerated		= false;

	this.marge				= 0;	// % of free space in the generated map
	this.nbRandTentatives	= 5;	// Number of try to find a place
	
	// Map creation
	var mapWidthUnit		= Math.ceil( settings['mapWidth'] /this.unite );
	var mapHeightUnit		= Math.ceil( settings['mapHeight']/this.unite );
	this.map				= new WalleryMap( this.unite, mapWidthUnit, mapHeightUnit );

	// Album creation
	this.album				= new WalleryAlbum(this.unite);
}


/* Interface *****************************************************************/

/**
 * Add an item in the album
 * @param int		width	Item width (in pixels)
 * @param int		height	Item height (in pixels)
 * @param *			object	Free object about the item (and will be accessible in the rendering)
 */
WalleryBuilder.prototype.addItem = function (width, height, object) {

	var item = new WalleryItem(width, height, object);
	if (item !== false)
		this.album.addItem(item);
};

/**
 * Add a stack of items in one function
 * @param	array	stack	Array of item data
 */
WalleryBuilder.prototype.addStack = function (stack) {

	// Check if there's data
	if (stack === undefined || stack.length === undefined || stack.length === 0)
		return false; //# DEV: Throw error

	var itemData;
	for (var itemIndex in stack) {
		// Creation of the object item and adding in the Album
		itemData = stack[itemIndex];
		this.addItem(itemData[0], itemData[1], itemData[2]);
	}
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

	// Sort the album (descending)
	this.album.sortIt();
	this.album.resetUsemeter();
	
	// First pass of map filling
	this.massMapFilling();

	// Fill the blank 
	this.mapBlankSpaceFilling();

	// Final step
	this.isGenerated = true;
};

/**
 * Fill the map when we start from blank
 * This is also the first step of the map filling
 * Here we set the items randomly (with a number of try), 
 * if it doesn't fit, we don't set it.
 * 
 * @return void
 */
WalleryBuilder.prototype.massMapFilling = function () {
	
	var nbAff, currentImg, placesAvailable;

	// Get the number of displaying of each item
	nbAff = Math.ceil( this.map.size * ((this.unite - this.marge) / this.unite) / this.album.size ) - 1;
	
	for (var i in this.album.portfolio) {
		
		// Get the item to put
		currentImg = this.album.portfolio[i];
		
		// Number of try (for the random solution)
		placesAvailable = true;
		
		while (currentImg.getUsemeter() < nbAff && placesAvailable) {
			
			if (this.map.putToRandomPlace(currentImg, nbAff) === false) {
			
				if (this.map.forceRandomPlace(currentImg) === false) {
					// Stop the loop: there's no more free space
					placesAvailable = false;
				}
			}
		}
	}
};

/**
 * Fill the rest of blank space.
 * This time the algorithm need to get the list of 
 * possible free position in a map to put a item
 *  
 * @return void
 */
WalleryBuilder.prototype.mapBlankSpaceFilling = function () {

	var i, limitFreeSpace, freePositionsList, thePosition, itemDisplayed;
	var placeWidth, placeHeight;

	i				= 0;
	limitFreeSpace	= Math.ceil(this.map.size * (this.marge/this.unite));

	while (this.map.freeSpace >= limitFreeSpace) {
		
		// Get the place dimensions we are looking for
		if (i < this.album.portfolio.length) {
			placeWidth  = this.album.portfolio[i].widthUnit;
			placeHeight = this.album.portfolio[i].heightUnit;
		}

		// In this case the random case hasn't been nice with us
		// => We gonna find a place manually
		freePositionsList = this.map.findPlace( placeWidth, placeHeight, 5 );

		if (freePositionsList !== false) {
		
			// thePosition = rand(0, freePositionsList.length -1);
			thePosition = Math.ceil(Math.random() * freePositionsList.length) % freePositionsList.length;
			
			// Random funtion
			//# DEV : Find a better way to get a random position in an array
			if (this.crop) {
				// Crop allowed, let's find a good item
				itemDisplayed = this.album.getItemBiggerThan(placeWidth, placeHeight);
				while (itemDisplayed.widthUnit < placeWidth || itemDisplayed.heightUnit < placeHeight) {
					itemDisplayed = this.album.portfolio[Math.ceil(Math.random() * i)];
				}
			}
			else {
				// Crop not allowed, let's use the current index
				itemDisplayed = this.album.portfolio[i];
			}

			this.map.putItem(	itemDisplayed,
								freePositionsList[thePosition]['x'],
								freePositionsList[thePosition]['y'],
								placeWidth,
								placeHeight);
		}
		else if (i > this.album.portfolio.length) {
			//# DEV: Find a better algo : if (placeWidth/placeHeight > this.mapWidth/this.mapHeight) {
			if (placeWidth>placeHeight)
				placeWidth--;
			else
				placeHeight--;
			if (placeWidth*placeHeight === 0) return;
		}

		i++;
		if (!this.crop && i == this.album.portfolio.length) return;
	}
};



