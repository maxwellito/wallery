/**
 * Map class
 * This class contain all the information about a mapping
 * 
 * WARNING!
 * All the sizes are in units, not in pixels
 *
 * @param	int			unite		Unite size in px
 * @param	int			width		Map size in unit
 * @param	int			height		Map height in unit
 */

WalleryMap = function ( unite, width, height ) {
		
	// Sucurity tests
	if ( width <= 0 && height <= 0 && unite <= 0 )
		return false;
	
	// Settings
	this.width		= width;
	this.height		= height;
	this.unite		= unite;
	
	// Get the size of the map
	this.size		= this.width * this.height;
	this.freeSpace	= this.size;
	
	// Map initialisation
	this.table		= [];
	
	var newLine, i, j;
	for (i=0; i<this.width; i++) {
		newLine = [];
		for (j=0; j<this.height; j++) {
			newLine.push(false);
		}
		this.table.psh(newLine);
	}
};
	
/**
 * Basic check on values
 * 
 * @param	int		posX	Pos X in unit
 * @param	int		posY	Pos Y in unit
 * @param	int		width	Width in unit
 * @param	int		height	Height in unit
 * @return	Boolean			True if the values are ok
 */
WalleryMap.prototype.valuesCheck = function (posX, posY, width, height) {
	
	// Security tests
	// > Positions out of map or null sizes
	if ( posX < 0 || posY < 0 || width <= 0 || height <= 0 )
		return false;
		
	// > Overflow
	if ((posX + width > this.width) || (posY + height > this.height))
		return false;
	
	// Everything is OK
	return true;
};
	
/**
 * Check if a zone is free on the map
 * 
 * @param	int		posX	Pos X in unit
 * @param	int		posY	Pos Y in unit
 * @param	int		width	Width in unit
 * @param	int		height	Height in unit
 * @return	Boolean			True if the values are ok
 */
WalleryMap.prototype.placeCheck = function (posX, posY, width, height) {
	
	// Security tests
	if ( !this.valuesCheck (posX, posY, width, height) )
		return false;
	
	// Treatment
	var i, j;
	for (i=0; i<width; i++) {
		for (j=0; j<height; j++) {
			if ( this.table[posX + i][posY + j] === true ) {
				return false; // This place is already taken
			}
		}
	}

	// The place is free
	return true;
};
	

/**
 * Method to put an image 
 * 
 * @param	array	pictureData	Object image 
 * @param	int		posX			Position on X where to put the image (in units)
 * @param	int		posY			Position on Y where to put the image (in units)
 * @param	int		width			Width of the place to put the image (in units)
 * @param	int		height			Height of the place to put the image (in units) 
 * @param	boolean	testr			Do we need to check if the place is free before to put the image ?
 * @return	boolean					True if it's a success
 */
WalleryMap.prototype.putImage = function (pictureData, posX, posY, width, height, testr) {
	
	// Security tests
	if ( testr === true ) {
		if ( !this.placeCheck (posX, posY, width, height) )
			return false;
	}
	else {
		if ( !this.valuesCheck (posX, posY, width, height) )
			return false;
	}
	
	// Treatement
	var i, j;
	for (i=0; i<width; i++) {
		for (j=0; j<height; j++) {
			this.table[posX + i][posY + j] = true;
		}
	}
	
	// Get the size of the image put in place
	size = width * height;
	
	// Update the free space of the map
	this.freeSpace -= size;
	
	// Add this image in the result array
	this.result.push({	image		: pictureData,
						posX		: (posX * this.unite),
						posY		: (posY * this.unite),
						width		: (width * this.unite),
						height		: (height * this.unite) });
	
	// Update the image counter
	pictureData.useCount--;
	
	// Everything is OK
	return true;
};
	
/**
 * Method to find a place in this map
 * You just have to give the width and height of the image to put in the map.
 * It will return an array with the position availables
 * 
 * @param	int		width			Width of the place to put the image (in units)
 * @param	int		height			Height of the place to put the image (in units) 
 * @return	array					List of free positions [{x(int), y(int)}]
 */
WalleryMap.prototype.findPlace = function (width, height) {
	
	// Get the free space
	var freeSpace		= this.freeSpace;
	
	// Size of the element
	var elementSize	= width * height;
	
	// Initialization
	var cols			= [];
	var combinaisons	= [];
	
	// Treatment
	var i, j, currentCol, counter;
	for (i=0; i<this.width && freeSpace >= elementSize; i++) {
		
		currentCol	= [];
		counter		= 0;
		
		for (j=0; j<this.height; j++) {
			
			if (this.table[i][j]) {
				counter = 0;
			}
			else {
				counter++;
				freeSpace--;
				if (counter >= height)
					currentCol.push(j - height + 1);
			}
		}
		cols.push(currentCol);
	}
	
	// Check if the counter don't stop us
	if ( cols.length < width ) {
		return false;
	}

	// Treatment of the previous algorithm
	for (i=0; i<this.height; i++) {
		
		counter = 0;
		
		for (j=0; j<cols.length; j++) {
			
			if (cols[j].indexOf(i) != -1) {
				counter = 0;
			}
			else {
				counter++;
				if (counter >= width)
					combinaisons.push({	y:	i,
										x:	j-width+1 });
			}
		}
	}
	
	// Return
	if (combinaisons.length === 0) {
		return false;
	} else {
		return combinaisons;
	}
};


/**
 * Method to get a random place in the map
 * But warning, the place can be taken
 * The setting are the dimensions of the image you want to put
 * 
 * @param	int		width			Width of the place to put the image (in units)
 * @param	int		height			Height of the place to put the image (in units) 
 * @return	array					The random position {x(int), y(int)}
 */
WalleryMap.prototype.getRandomPlace = function (width, height) {
	
	return {x:	rand(0, this.width - width),
			y:	rand(0, this.height - height)};
};

/**
 * Make the final rendering
 * 
 * @param	int		margin		Margin in pixel
 * @return	string				HTML rendered
 */
WalleryMap.prototype.rendering = function (margin) {

	var border			= margin === undefined ? 0 : margin;
	var margeDiv		= border * 2;
	var htmlContent		= "";

	var i, imageX, imageY, currentElement, currentImg;
	for (i=0; i<this.result.length; i++) {

		// Init
		currentElement	= this.result[i];
		currentImg		= currentElement['image'];

		imageX = rand(0, currentImg.widthPx - currentElement['width'] + border);
		imageY = rand(0, currentImg.heightPx - currentElement['height'] + border);

		imageX += border;
		imageY += border;

		// Pattern for an image
		htmlContent += "<div class='imgContainer' style='";
		htmlContent += "left: "	+ (currentElement['posX']  + border) + "px;";
		htmlContent += "top: "		+ (currentElement['posY']  + border) + "px;";
		htmlContent += "width:"	+ (currentElement['width']  - margeDiv) +"px;";
		htmlContent += "height:"	+ (currentElement['height'] - margeDiv) +"px;";
		htmlContent += "background-image: url("+currentImg+url+");";
		htmlContent += "background-position: -"+imageX+"px -"+imageY+ "px; ";
		htmlContent += "display:none;";
		htmlContent += "' ></div>";
	}

	return htmlContent;
};

	
/* Debug *****************************************************************/

/**
 * Display the map in text on the output
 */
WalleryMap.prototype.displayMap = function () {

	var i, j;
	for (j=0; j<this.height; j++) {
		for (i=0; i<this.width; i++) {
			if ( this.table[i][j] )
				console.log("#");
			else
				console.log(".");
		}
		console.log("---");
	}
};