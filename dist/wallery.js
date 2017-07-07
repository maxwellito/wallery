/**
 * wallery - Generate a map from a list of displayable elements
 * @version v1.0.0
 * @link https://github.com/maxwellito/wallery#readme
 * @license MIT
 */

'use strict';

(function (window) {

  
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
  /**
 * Class Album
 * This class contain the list of items to display in the map.
 * Basically, it's just a big Array.
 * But it's cleaner..
 *
 * @param int unit Unit in pixels
 */

function WalleryAlbum ( unit ) {
    
  // Tests
  if ( unit <= 0 ) {
    return false;
  }
  
  // Initialisation
  this.unit = unit;
  this.size = 0;
  this.isSorted = true;
  this.portfolio = [];
}

/**
 * To add an item in the album
 * 
 * @param WalleryItem object  item  Item object to add in the collection
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
 * @param   int  width   Min item width in unit
 * @param   int  height  Min item height in unit
 * @return  *            An WalleryItem object, or false if nothing is available
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
 * @param   int    width   Min item width in unit
 * @param   int    height  Min item height in unit
 * @return  array          An Array full of WalleryItem objects
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
 * @param string  prefix  Prefix before the display of each line
 */
WalleryAlbum.prototype.display = function ( prefix ) {

  prefix = prefix === undefined ? '' : prefix;

  console.log(prefix + 'Class Album');
  console.log(prefix + 'unit : ' + this.unit);
  console.log(prefix + 'size : ' + this.size);
  
  // Display all the informations of the items in the library
  for (var i in this.portfolio) {
    this.portfolio[i].display('    ');
  }
};
  /**
 * Map class
 * This class contain all the information about a mapping
 * 
 * WARNING!
 * All the sizes are in units, not in pixels
 *
 * @param int     unit      Unit size in px
 * @param int     width     Map size in unit
 * @param int     height    Map height in unit
 */

function WalleryMap ( unit, width, height ) {
    
  // Sucurity tests
  if ( width <= 0 && height <= 0 && unit <= 0 )
    return false;
  
  // Settings
  this.width  = width;
  this.height = height;
  this.unit   = unit;
  
  // Get the size of the map
  this.size = this.width * this.height;
  this.freeSpace = this.size;
  this.result = [];
  
  // Map initialisation
  this.table = [];
  
  var newLine, i, j;
  for (i=0; i<this.width; i++) {
    newLine = [];
    for (j=0; j<this.height; j++) {
      newLine.push(false);
    }
    this.table.push(newLine);
  }
}
  
/**
 * Basic check on values
 * 
 * @param   int     posX    Pos X in unit
 * @param   int     posY    Pos Y in unit
 * @param   int     width   Width in unit
 * @param   int     height  Height in unit
 * @return  Boolean         True if the values are ok
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
 * @param   int   posX    Pos X in unit
 * @param   int   posY    Pos Y in unit
 * @param   int   width   Width in unit
 * @param   int   height  Height in unit
 * @return  Boolean       True if the values are ok
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
 * Method to put an item 
 * 
 * @param   WalleryItem item      Item to set    
 * @param   int         posX      Position on X where to put the item (in units)
 * @param   int         posY      Position on Y where to put the item (in units)
 * @param   int         width     Width of the place to put the item (in units)
 * @param   int         height    Height of the place to put the item (in units) 
 * @param   boolean     testr     Do we need to check if the place is free before to put the item ?
 * @return  boolean               True if it's a success
 */
WalleryMap.prototype.putItem = function (item, posX, posY, width, height, testr) {
  
  // Security tests
  if ( testr === true ) {
    if ( !this.placeCheck (posX, posY, width, height) )
      return false;
  }
  else {
    if ( !this.valuesCheck (posX, posY, width, height) )
      return false;
  }

  // Set default values
  if (width === undefined)  width = item.widthUnit;
  if (height === undefined) height  = item.heightUnit;
  
  // Treatement
  var i, j, size;
  for (i=0; i<width; i++) {
    for (j=0; j<height; j++) {
      this.table[posX + i][posY + j] = true;
    }
  }
  
  // Get the size of the item put in place
  size = width * height;
  
  // Update the free space of the map
  this.freeSpace -= size;
  
  // Add this item in the result array
  this.result.push({
    item    : item,
    posX    : (posX * this.unit),
    posY    : (posY * this.unit),
    width   : (width * this.unit),
    height  : (height * this.unit)
  });
  
  // Update the item counter
  item.incUsemeter();
  
  // Everything is OK
  return true;
};
  
/**
 * Put an item into a random place
 * The algorithm accept 2 params : the item to place and the number of tentatives
 * We get a random position on the map, try if it fit
 * if so we place it.
 * otherwise we try again (and this for the amount of try we set)
 * 
 * @param   WalleryItem object        Item object to place
 * @param   int         nbTentatives  Number of tentative before to fail 
 * @return  array                     Position or false
 */
WalleryMap.prototype.putToRandomPlace = function (item, nbTentatives) {
  
  // Random test to find a place on the map
  var positionToTry;
  var isPlaced = false;
  
  while ( !isPlaced && (nbTentatives > 0) ) {
    
    nbTentatives--;
    positionToTry = this.getRandomPlace( item.widthUnit, item.heightUnit );
    isPlaced    = this.placeCheck(
      positionToTry.x,
      positionToTry.y,
      item.widthUnit,
      item.heightUnit
    );
  }
  
  // If place has been find we put the item
  // Else we try manually (but it need more ressources and time)
  if (isPlaced) {
    
    this.putItem( item,
            positionToTry.x,
            positionToTry.y);

    return positionToTry;
  }

  return false;
};

/**
 * This method force to place an item in the map
 * The first step is to get all the free combinaisons available
 * then choose one randomly to place the object
 * then we return the position.
 * If there's no space, we return false.
 * 
 * @param   WalleryItem object    Item object to place
 * @return  array                 Position or false
 */
WalleryMap.prototype.forceRandomPlace = function (item) {

  // In this case the random case hasn't been nice with us
  // => We gonna find a place manually
  var positionsList = this.findPlace( item.widthUnit, item.heightUnit );
  
  if (positionsList === false)
    return false;
  
  var theOne = Math.ceil(Math.random() * positionsList.length) % positionsList.length;
  this.putItem( item,
          positionsList[theOne].x,
          positionsList[theOne].y);

  return positionsList[theOne];
};

/**
 * Method to find a place in this map
 * You just have to give the width and height of the item to put in the map.
 * It will return an array with the position availables
 * 
 * @param   int   width       Width of the place to put the item (in units)
 * @param   int   height      Height of the place to put the item (in units) 
 * @param   int   amountMax   Maximum amount of result returned (min: 1)
 * @return  array             List of free positions [{x(int), y(int)}]
 */
WalleryMap.prototype.findPlace = function (width, height, amountMax) {
  
  var x, y;
  var combinaisons = [];
  amountMax = (amountMax === undefined || amountMax < 1) ? this.size : amountMax;

  for (x = 0; x + width <= this.width; x++) {
    for (y = 0; y + height <= this.height; y++) {
      if (this.placeCheck(x, y, width, height)) {
        combinaisons.push({ x:  x,
                  y:  y });
        if (combinaisons.length == amountMax)
          return combinaisons;
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
 * The setting are the dimensions of the item you want to put
 * 
 * @param   int   width    Width of the place to put the item (in units)
 * @param   int   height   Height of the place to put the item (in units) 
 * @return  array          The random position {x(int), y(int)}
 */
WalleryMap.prototype.getRandomPlace = function (width, height) {
  
  return {x:  Math.ceil(Math.random() * (this.width - width)),
      y:  Math.ceil(Math.random() * (this.height - height))};
};

/**
 * Make the final rendering
 * 
 * @param   int    margin  Margin in pixel
 * @return  string         HTML rendered
 */
WalleryMap.prototype.rendering = function (tplFunction) {

  var wrapper = document.createElement('div');
  var place, tplData;

  for (var i in this.result) {

    place = this.result[i];

    tplData = {
      place: {
        posX: place.posX,
        posY: place.posY,
        width:  place.width,
        height: place.height
      },
      item: {
        width:  place.item.widthPx,
        height: place.item.heightPx,
      },
      data:   place.item.attached
    };

    tplData.item.posX = Math.ceil(Math.random() * (tplData.item.width  - tplData.place.width  ));
    tplData.item.posY = Math.ceil(Math.random() * (tplData.item.height - tplData.place.height ));

    wrapper.appendChild(tplFunction(tplData));
  }

  return wrapper;
};

  
/* Debug *****************************************************************/

/**
 * Display the map in text on the output
 */
WalleryMap.prototype.displayMap = function () {

  var i, j, row;
  for (j=0; j<this.height; j++) {
    row = '';
    for (i=0; i<this.width; i++) {
      if ( this.table[i][j] )
        row += '#';
      else
        row += '.';
    }
    console.log(row);
  }
};
  /**
 * Wallery class
 * This class content all the informations and algorithms about a wall
 *
 *
 * @param Array settings 
 *        int       'unit'      Bloc size in pixel
 *        int       'mapWidth'  Map width in pixel
 *        int       'mapHeight' Map height in pixel
 *        boolean   'crop'      Allow to crop your item (default: true)
 *        function  'template'  Template function
 */

function Wallery (settings) {
  
  /* Variables *************************************************************/
    
  // Tests
  // Check if variables are set
  if (settings.unit === undefined   ||
    settings.mapWidth === undefined || settings.mapHeight === undefined)
    throw 'Wallery: settings aren\'t defined';
  
  // Check unit
  if (settings.unit <= 0)
    throw 'Wallery: unit is not valid';
  
  // Check the map size
  if (settings.unit > settings.mapWidth || settings.unit > settings.mapHeight)
    throw 'Wallery: unit is bigger than the map';
    
  // Everything is OK
  this.unit        = settings.unit;
  this.mapWidthPx  = settings.mapWidth;
  this.mapHeightPx = settings.mapHeight;
  this.crop        = settings.crop !== undefined ? settings.crop : true;
  
  this.isGenerated = false;

  this.marge            = 0;  // % of free space in the generated map
  this.nbRandTentatives = 5;  // Number of try to find a place
  
  // Map creation
  var mapWidthUnit  = Math.ceil( settings.mapWidth /this.unit );
  var mapHeightUnit = Math.ceil( settings.mapHeight/this.unit );
  this.map          = new WalleryMap( this.unit, mapWidthUnit, mapHeightUnit );

  // Album creation
  this.album = new WalleryAlbum(this.unit);
}


/* Interface *****************************************************************/

/**
 * Add an item in the album
 * @param int   width Item width (in pixels)
 * @param int   height  Item height (in pixels)
 * @param *     object  Free object about the item (and will be accessible in the rendering)
 */
Wallery.prototype.addItem = function (width, height, object) {

  var item = new WalleryItem(width, height, object);
  if (item !== false)
    this.album.addItem(item);
};

/**
 * Add a stack of items in one function
 * @param array stack Array of item data
 */
Wallery.prototype.addStack = function (stack) {

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
 * @param Int level New motel level value to set
 */
Wallery.prototype.setMotorLevel = function (level) {
  
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
 * @param Int ffs New final free space value to set
 */
Wallery.prototype.setFinalFreeSpace = function (ffs) {
  
  if (ffs >= 0 && ffs <= 100) {
    this.marge = ffs;
    return true;
  } else {
    return false;
  }
};

/**
 * Rendering of the wall
 * @param function tplFunction Templating function to generate an item DOM
 * @return String Rendered code
 */
Wallery.prototype.rendering = function (tplFunction) {

  if (!tplFunction)
    return;

  return this.map.rendering(tplFunction);
};


/* Engine ****************************************************************/

/**
 * Generate a wall
 * @return void
 */
Wallery.prototype.generate = function () {

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
Wallery.prototype.massMapFilling = function () {
  
  var nbAff, currentImg, placesAvailable;

  // Get the number of displaying of each item
  nbAff = Math.ceil( this.map.size * ((this.unit - this.marge) / this.unit) / this.album.size ) - 1;
  
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
Wallery.prototype.mapBlankSpaceFilling = function () {

  var i, limitFreeSpace, freePositionsList, thePosition, itemDisplayed;
  var placeWidth, placeHeight;

  i = 0;
  limitFreeSpace = Math.ceil(this.map.size * (this.marge/this.unit));

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

      this.map.putItem( itemDisplayed,
                freePositionsList[thePosition].x,
                freePositionsList[thePosition].y,
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

  window.Wallery = Wallery;

}(window));
