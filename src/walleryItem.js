
/**
 * Item class
 * This class contain all the information about 
 * a displayable item.
 * 
 *
 * @param int     widthPx   Item width in pixels
 * @param int     heightPx  Item height in pixels
 * @param object  attached  Attached data object (not required)
 */

function WalleryItem (widthPx, heightPx, attached) {
    
  // Set the dimensions (px and unit) and size (unit)
  this.widthPx    = widthPx;
  this.heightPx   = heightPx;
  this.widthUnit  = 0;
  this.heightUnit = 0;
  this.size       = 0;

  this.usemeter   = 0;
  
  // Attached object
  this.attached   = attached;
}
  
  
/**
 * Update a unit value
 * @param   int   unit  Update the item size in unit
 * @return  boolean     True if it's ok
 */
WalleryItem.prototype.updateUnit = function ( unit ) {
    
  // Settings test
  if ( unit > this.widthPx || unit > this.heightPx ) {
    return false;
  }
  
  // Get the dimentions of the item in units
  this.widthUnit  = Math.floor(this.widthPx / unit);
  this.heightUnit = Math.floor(this.heightPx / unit);
  
  // Get the size of the item in square unit
  this.size = this.widthUnit * this.heightUnit;
  
  return true;
};

/**
 * Reset the usemeter of the instance
 */
WalleryItem.prototype.resetUsemeter = function () {

  this.usemeter = 0;
};

/**
 * Increment usemeter
 */
WalleryItem.prototype.incUsemeter = function () {
  
  this.usemeter += 1;
};

/**
 * Get usemeter value
 */
WalleryItem.prototype.getUsemeter = function () {
  
  return this.usemeter;
};
  

/* Debug *****************************************************************/

/**
 * Display an item information
 * @param string  prefix    Prefix before the display of each line
 */
WalleryItem.prototype.display = function ( prefix ) {
  
  console.log(prefix + 'Class WalleryItem');
  
  console.log(prefix + 'widthPx:    ' + this.widthPx);
  console.log(prefix + 'heightPx:   ' + this.heightPx);
  console.log(prefix + 'widhtUnit:  ' + this.widthUnit);
  console.log(prefix + 'heightUnit: ' + this.heightUnit);
  
  console.log(prefix + 'size:       ' + this.size);
  console.log(prefix + 'usemeter:   ' + this.usemeter);
  console.log(prefix + 'url:        ' + this.url);

  console.log('---');
};