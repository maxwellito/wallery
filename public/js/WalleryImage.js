
/**
 * Image class
 * This class contain all the information about an image
 * 
 *
 * @param	string	url			URL of the image
 * @param	int		widthPx	Image width in pixels
 * @param	int		heightPx	Image height in pixels
 * @param	object	attached	Attached data object (not required)
 */

function WalleryImage (url, widthPx, heightPx, attached) {
		
	// Set the dimensions (px and unit) and size (unit)
	this.widthPx		= widthPx;
	this.heightPx		= heightPx;
	this.widthUnit		= 0;
	this.heightUnit		= 0;
	this.size			= 0;

	this.usemeter		= 0;
	this.url			= url;
	
	// Attached object
	this.attached		= attached;
}
	
	
/**
 * Update a unit value
 * @param	int		unite	Update the image size in unit
 * @return	boolean			True if it's ok
 */
WalleryImage.prototype.updateUnite = function ( unite ) {
		
	// Settings test
	if ( unite > this.widthPx || unite > this.heightPx ) {
		return false;
	}
	
	// Get the dimentions of the images in units
	this.widthUnit	= Math.floor(this.widthPx / unite);
	this.heightUnit	= Math.floor(this.heightPx / unite);
	
	// Get the size of the image in square unit
	this.size = this.widthUnit * this.heightUnit;
	
	return true;
};

/**
 * Reset the usemeter of the instance
 */
WalleryImage.prototype.resetUsemeter = function () {

	this.usemeter = 0;
};

/**
 * Increment usemeter
 */
WalleryImage.prototype.incUsemeter = function () {
	
	this.usemeter += 1;
};

/**
 * Get usemeter value
 */
WalleryImage.prototype.getUsemeter = function () {
	
	return this.usemeter;
};
	

/* Debug *****************************************************************/

/**
 * Display a picture information
 * @param	string	prefix		Prefix before the display of each line
 */
WalleryImage.prototype.display = function ( prefix ) {
	
	console.log(prefix + "Class Image");
	
	console.log(prefix + "widthPx:    " + this.widthPx);
	console.log(prefix + "heightPx:   " + this.heightPx);
	console.log(prefix + "widhtUnit:  " + this.widthUnit);
	console.log(prefix + "heightUnit: " + this.heightUnit);
	
	console.log(prefix + "size:       " + this.size);
	console.log(prefix + "usemeter:   " + this.usemeter);
	console.log(prefix + "url:        " + this.url);

	console.log('---');
};