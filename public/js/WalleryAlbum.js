/**
 * Class Album
 * This class contain the list of images to display in the map.
 * It can evolve te can contain more information about pictures.
 * Basically, it's just a big Array.
 * But it's cleaner..
 *
 * @param	int		unite	Unite in pixels
 */

function WalleryAlbum ( unite ) {
		
	// Tests
	if ( unite <= 0 ) {
		return false;
	}
	
	// Initialisation
	this.unite		= unite;
	this.size		= 0;
	this.isSorted	= true;
	this.portfolio	= [];
}

/**
 * To add an image in the album
 * 
 * @param	image object	image	Image object to add in the collection
 */
WalleryAlbum.prototype.addImage = function ( image ) {
		
	// Security test
	if ( !image.updateUnite(this.unite) )
		return false;
	
	// Add the picture in the library
	this.portfolio.push(image);
	
	// Album update
	this.isSorted = false;
	this.size += image.size;
	
	// Everything is OK
	return true;
};

/**
 * Reset the usemeter of all the picture of the album instance
 */
WalleryAlbum.prototype.resetUsemeter = function () {
	
	for (var i in this.portfolio) {
		this.portfolio[i].resetUsemeter();
	}
};
	
/**
 * Sort images in the order for a future treatment
 */
WalleryAlbum.prototype.sortIt = function () {
		
	this.portfolio.sort( function (a,b) {
		return b.size - a.size;
	});
	this.isSorted = true;
	return;
};

/**
 * Get a random image from the album which the dimensions
 * are bigger than given
 *
 * @param	int		width	Min image width in unit
 * @param	int		height	Min image height in unit
 * @return	*				An WalleryImage object, or false if nothing is available
 */
WalleryAlbum.prototype.getImageBiggerThan = function (width, height) {
		
	var list = this.getImageListBiggerThan(width, height);
	if (list === false)
		return false;
	else
		return list[ Math.ceil(Math.random()*list.length)%list.length ];
};

/**
 * Get a list of imagea from the album 
 * which the dimensions are bigger than given
 *
 * @param	int		width	Min image width in unit
 * @param	int		height	Min image height in unit
 * @return	array			An Array full of WalleryImage objects
 */
WalleryAlbum.prototype.getImageListBiggerThan = function (width, height) {
		
	var list = [];
	var currentImg;

	for(var index in this.portfolio) {
		currentImg = this.portfolio[index];
		if (currentImg.widthUnit >= width && currentImg.heightUnit >= height)
			list.push(currentImg);
	}
	return list;
};

	
	
/* Debug *****************************************************************/

/**
 * Display an album information
 * @param	string	prefix		Prefix before the display of each line
 */
WalleryAlbum.prototype.display = function ( prefix ) {

	prefix = prefix === undefined ? '' : prefix;

	console.log(prefix + "Class Album");
	console.log(prefix + "unite :  " + this.unite);
	console.log(prefix + "size :   " + this.size);
	
	// Display all the informations of the images in the library
	for (var i in this.portfolio) {
		this.portfolio[i].display("    ");
	}
};