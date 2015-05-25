/**
 * Class Album
 * This class contain the list of items to display in the map.
 * Basically, it's just a big Array.
 * But it's cleaner..
 *
 * @param	int		unit	Unit in pixels
 */

function WalleryAlbum ( unit ) {
		
	// Tests
	if ( unit <= 0 ) {
		return false;
	}
	
	// Initialisation
	this.unit		= unit;
	this.size		= 0;
	this.isSorted	= true;
	this.portfolio	= [];
}

/**
 * To add an item in the album
 * 
 * @param	WalleryItem object	item	Item object to add in the collection
 */
WalleryAlbum.prototype.addItem = function ( item ) {
		
	// Security test
	if ( !item.updateUnit(this.unit) )
		return false;
	
	// Add the item in the library
	this.portfolio.push(item);
	
	// Album update
	this.isSorted = false;
	this.size += item.size;
	
	// Everything is OK
	return true;
};

/**
 * Reset the usemeter of all the item of the album instance
 */
WalleryAlbum.prototype.resetUsemeter = function () {
	
	for (var i in this.portfolio) {
		this.portfolio[i].resetUsemeter();
	}
};
	
/**
 * Sort items in the order for a future treatment
 */
WalleryAlbum.prototype.sortIt = function () {
		
	this.portfolio.sort( function (a,b) {
		return b.size - a.size;
	});
	this.isSorted = true;
	return;
};

/**
 * Get a random item from the album which the dimensions
 * are bigger than given
 *
 * @param	int		width	Min item width in unit
 * @param	int		height	Min item height in unit
 * @return	*				An WalleryItem object, or false if nothing is available
 */
WalleryAlbum.prototype.getItemBiggerThan = function (width, height) {
		
	var list = this.getItemListBiggerThan(width, height);
	if (list === false)
		return false;
	else
		return list[ Math.ceil(Math.random()*list.length)%list.length ];
};

/**
 * Get a list of items from the album 
 * which the dimensions are bigger than given
 *
 * @param	int		width	Min item width in unit
 * @param	int		height	Min item height in unit
 * @return	array			An Array full of WalleryItem objects
 */
WalleryAlbum.prototype.getItemListBiggerThan = function (width, height) {
		
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
	console.log(prefix + "unit :  " + this.unit);
	console.log(prefix + "size :   " + this.size);
	
	// Display all the informations of the items in the library
	for (var i in this.portfolio) {
		this.portfolio[i].display("    ");
	}
};