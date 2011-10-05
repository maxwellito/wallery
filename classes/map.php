<?

class Map {
		
	/*	Classe map
		VARNING! : All the sizes are in units, not in pixels
	*/
	
	
	// Variables
	var $table;							// Occupation map
	var $width;							// Width of the map (in units)
	var $height;						// Height of the map (in units)
	var $size;							// Size of the map (in square units)
	var $free_space;					// Free space (in square units)
	
	var $unite;							// Value of an unit (in pixels)
	
	var $result = array();				// Result array
	
	
	// Initialistion
	function initialisation( $pUnite, $pWidth, $pHeight ) {
		
		// Sucurity tests
		if ( $pWidth <= 0 && $pHeight <= 0 && $pUnite <= 0 )
			return false;
		
		// Settings
		$this->width = $pWidth;
		$this->height = $pHeight;
		$this->unite = $pUnite;
		
		// Get the size of the map
		$this->size = $this->width * $this->height;
		$this->free_space = $this->size;
		
		// Map initialisation
		$this->table = array();
		
		for ($i=0; $i<$this->width; $i++) {
			$new_line = array();
			for ($j=0; $j<$this->height; $j++)
				$new_line[] = false;
			$this->table[] = $new_line;
		}
		
		// Everything is OK
		return true;
	}
	
	
	// Values Checker
	///////////////////////////////////////////////////////////////////////////////
	function values_check ($pPos_x, $pPos_y, $pWidth, $pHeight) {
		
		// Security tests
		// > Positions out of map or null sizes
		if ( $pPos_x < 0 || $pPos_y < 0 || $pWidth <= 0 || $pHeight <= 0 )
			return false;
			
		// > Overflow
		if (($pPos_x + $pWidth > $this->width) || ($pPos_y + $pHeight > $this->height))
			return false;
		
		// Everything is OK
		return true;
	}
	
	// Method to check if a place is free
	// Reminder: every values are in units
	///////////////////////////////////////////////////////////////////////////////
	function place_check ($pPos_x, $pPos_y, $pWidth, $pHeight) {
		
		// Security tests
		if ( !$this->values_check ($pPos_x, $pPos_y, $pWidth, $pHeight) )
			return false;
		
		// Treatment
		for ($i=0; $i<$pWidth; $i++) {
		
			for ($j=0; $j<$pHeight; $j++) {
				
				if ( $this->table[$pPos_x + $i][$pPos_y + $j] ) {
					return false; // This place is already taken
				} 
			}
		}
		
		// The place is free
		return true;
	}
	
	
	// Method to place an image
	// The settings are about the image to place
	//
	// 		pImg		Object image 
	//		pPos_x 		Position on X where to put the image (in units)
	//		pPos_y 		Position on Y where to put the image (in units)
	//		pWidth 		Width of the place to put the image (in units)
	//		pHeight		Height of the place to put the image (in units) 
	//		pTest		Do we need to check if the place is free before to put the image ?
	//
	///////////////////////////////////////////////////////////////////////////////
	function put_image (&$pImg, $pPos_x, $pPos_y, $pWidth, $pHeight, $pTest = false) {
		
		// Security tests
		if ( $pTest ) {
			if ( !$this->place_check ($pPos_x, $pPos_y, $pWidth, $pHeight) )
				return false;
		}
		else {
			if ( !$this->values_check ($pPos_x, $pPos_y, $pWidth, $pHeight) )
				return false;
		}
		
		// Treatement
		for ($i=0; $i<$pWidth; $i++) {
		
			for ($j=0; $j<$pHeight; $j++) {
				
				$this->table[$pPos_x + $i][$pPos_y + $j] = true;
			}
		}
		
		// Get the size of the image put in place
		$size = $pWidth * $pHeight;
		
		// Update the free space of the map
		$this->free_space -= $size;
		
		// Add this image in the result array
		$this->result[] = array(	'image' => $pImg, 
									'pos_x' => ($pPos_x * $this->unite), 
									'pos_y' => ($pPos_y * $this->unite), 
									'width' => ($pWidth * $this->unite), 
									'height' => ($pHeight * $this->unite));
		
		// Update the image counter
		$pImg->use_count--;
		
		// Everything is OK
		return true;
		
	}
	
	
	// Method to find a place in this map
	// You just have to give the width and height of the image to put in the map.
	// It will return an array with the position availables
	///////////////////////////////////////////////////////////////////////////////
	function find_place ($pWidth, $pHeight) {
		
		
		// Get the free space
		$free_space = $this->free_space;
		
		// Size of the element
		$element_size = $pWidth*$pHeight;
		
		// Initialization
		$cols = array();
		$combinaisons = array();
		
		
		// Treatment
		for ($i=0; $i<$this->width && $free_space >= $element_size; $i++) {
			
			$current_col = array();
			$counter = 0;
			
			for ($j=0; $j<$this->height; $j++) {
				
				if ($this->table[$i][$j]) {
					
					$counter = 0;
				}
				else {
					$counter++;
					$free_space--;
					if ($counter >= $pHeight) 
						$current_col[] = $j-$pHeight+1;
				}
			}
			
			$cols[] = $current_col;
		}
		
		
		// Check if the counter don't stop us
		if ( count($cols)<$pWidth ) {
			return false;
		}
		
		
		// Treatment of the previous algorithm
		for ($i=0; $i<$this->height; $i++) {
			
			$counter = 0;
			
			for ($j=0; $j<count($cols); $j++) {
				
				if ( !in_array($i, $cols[$j]) ) {
					$counter = 0;
				}
				else {
					$counter++;
					if ($counter >= $pWidth) 
						$combinaisons[] = array('y' => $i, 'x' => $j-$pWidth+1);
				}
			}
		}
		
		
		// Return
		if (count($combinaisons)==0) {
			return false;
		} else {
			return $combinaisons;
		}
	}
	
	// Method to get a random place in the map
	// But warning, the place can be taken
	// The setting are the dimensions of the image you want to put
	///////////////////////////////////////////////////////////////////////////////
	function get_random_place ( $pWidth, $pHeight ) {
		
		return array(	'x' => rand(0, $this->width - $pWidth), 
						'y' => rand(0, $this->height - $pHeight) );
	
	}
	
	// Display the map in text (debug fonction)
	///////////////////////////////////////////////////////////////////////////////
	function display_map () {
	
		for ($j=0; $j<$this->height; $j++) {
			for ($i=0; $i<$this->width; $i++) {
				if ( $this->table[$i][$j] )
					print ("#");
				else
					print (".");
			}
			print ("<br/>");
		}
	}
	
	// Make the final rendering
	///////////////////////////////////////////////////////////////////////////////
	function rendering ($pMargin = 0) {
	
		$border = $pMargin;
		$marge_div = $border * 2;
		$html_content = "";
		
		for ($i=0; $i<count( $this->result ); $i++) {
			
			// Init
			$current_element = $this->result[$i];
			$current_img = $current_element['image'];
			
			$image_x = rand(0, $current_img->width_px - $current_element['width'] + $border);
			$image_y = rand(0, $current_img->height_px - $current_element['height'] + $border);
			
			$image_x += $border;
			$image_y += $border;
			
			
			// Pattern for an image
			$html_content .= "<div class='img_container' style='";
			$html_content .= "left: " . ($current_element['pos_x'] + $border) . "px;";
			$html_content .= "top: " . ($current_element['pos_y'] + $border) . "px;";
			$html_content .= "width:". ($current_element['width'] - $marge_div) ."px;";
			$html_content .= "height:". ($current_element['height'] - $marge_div) ."px;";
			$html_content .= "' >";
			
			$html_content .= "<a href='http://www.maxwellito.com".$current_img->attached."' rel='facebox'>";
			
			$html_content .= "<img src='".$current_img->url."' ";
			$html_content .= "style='";
			$html_content .= "display:none;";
			$html_content .= "right:".$image_x. "px;";
			$html_content .= "bottom:" .$image_y. "px;' ";
			$html_content .= "/>";
			
			$html_content .= "</a>";
			
			$html_content .= "</div>";
		}
		
		return $html_content;
	
	}

}

?>