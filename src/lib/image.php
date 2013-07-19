<?

/**
 * Image class
 * This class contain all the information about an image
 * 
 *
 */

class Image {
		
	/* Variables *************************************************************/

	var $width_px;				// Width (in pixels)
	var $height_px;				// Height (in pixels)
	var $width_unit;			// Width (in unit)
	var $height_unit;			// Height (in unit)
	
	var $size;					// Size of the image in square unit
	var $use_count;				// Count use
	
	var $url;					// Link to the midget (used in the wallery)
	
	var $attached;				// Extra info about this picture
	
	
	
	/**
	 * Initialisation
	 * @param	string	$url		URL of the image
	 * @param	int		$width_px	Image width in pixels
	 * @param	int		$height_px	Image height in pixels
	 * @param	object	$attached	Attached data object (not required)
	 * @return	boolean				True if it's ok
	 */
	function initialisation( $url, $width_px, $height_px, $attached = null) {
		
		// Tests
		if ( $url == "" )
			return false;
		
		// Params
		$this->url 			= $url;
		$this->width_px 	= $width_px;
		$this->height_px 	= $height_px;
		$this->attached 	= $attached;
		
		$this->size = 0;
		
		// Everything is OK
		return true;
	}
	
	/**
	 * Update a unit value
	 * @param	int		$unite	Update the image size in unit
	 * @return	boolean			True if it's ok
	 */
	function update_unite ( $unite ) {
		
		// Settings test
		if ( $unite>$this->width_px || $unite>$this->height_px ) {
			return false;
		}
		
		// Get the dimentions of the images in units
		$this->width_unit = floor($this->width_px / $unite);
		$this->height_unit = floor($this->height_px / $unite);
		
		// Get the size of the image in square unit
		$this->size = $this->width_unit * $this->height_unit;
		
		return true;
	}
	

	/* Debug *****************************************************************/

	/**
	 * Display a picture information
	 * @param	string	$prefix		Prefix before the display of each line
	 */
	function display ( $prefix = "" ) {
		
		printf("%sClass Image<br>", 		$prefix);
		
		printf("%swidth_px: %d<br>", 		$prefix, 	$this->width_px);
		printf("%sheight_px: %d<br>", 		$prefix, 	$this->height_px);
		printf("%swidht_unit: %d<br>", 		$prefix, 	$this->width_unit);
		printf("%sheight_unit: %d<br>", 	$prefix, 	$this->height_unit);
		
		printf("%ssize: %d<br>", 			$prefix, 	$this->size);
		printf("%suse_count: %d<br>", 		$prefix, 	$this->use_count);
		printf("%surl: %d<br><br>", 		$prefix, 	$this->url);
	}
}