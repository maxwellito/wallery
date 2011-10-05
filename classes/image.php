<?

class Image {
		
	/*	Class Image
		Contain all the informations about an image
	*/
	
	
	// Variables
	var $width_px;				// Width (in pixels)
	var $height_px;				// Height (in pixels)
	var $width_unit;			// Width (in unit)
	var $height_unit;			// Height (in unit)
	
	var $size;					// Size of the image in square unit
	var $use_count;				// Count use
	
	var $url;					// Link to the midget (used in the wallery)
	
	var $attached;				// Extra info about this picture
	
	
	
	// Initialistion
	function initialisation( $pUrl, $pWidth_px, $pHeight_px, $pAttached = null) {
		
		// Tests
		if ( $pUrl == "" )
			return false;
		
		// Params
		$this->url 			= $pUrl;
		$this->width_px 	= $pWidth_px;
		$this->height_px 	= $pHeight_px;
		$this->attached 	= $pAttached;
		
		$this->size = 0;
		
		// Everything is OK
		return true;
	}
	
	
	// Update unit method
	///////////////////////////////////////////////////////////////////////////////
	function update_unite ( $pUnite ) {
		
		// Settings test
		if ( $pUnite>$this->width_px || $pUnite>$this->height_px ) {
			return false;
		}
		
		// Get the dimentions of the images in units
		$this->width_unit = floor($this->width_px / $pUnite);
		$this->height_unit = floor($this->height_px / $pUnite);
		
		// Get the size of the image in square unit
		$this->size = $this->width_unit * $this->height_unit;
		
		return true;
	}
	
	
	// Fonction d'affichage du contenu de l'objet
	///////////////////////////////////////////////////////////////////////////////
	function display ( $pPre = "" ) {
		
		printf("%sClass Image<br>", 		$pPre);
		
		printf("%swidth_px: %d<br>", 		$pPre, 	$this->width_px);
		printf("%sheight_px: %d<br>", 		$pPre, 	$this->height_px);
		printf("%swidht_unit: %d<br>", 		$pPre, 	$this->width_unit);
		printf("%sheight_unit: %d<br>", 	$pPre, 	$this->height_unit);
		
		printf("%ssize: %d<br>", 			$pPre, 	$this->size);
		printf("%suse_count: %d<br>", 		$pPre, 	$this->use_count);
		printf("%surl: %d<br><br>", 		$pPre, 	$this->url);
	}
}

?>