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