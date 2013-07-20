<?

/**
 * Map class
 * This class contain all the information about a mapping
 * 
 * WARNING!
 * All the sizes are in units, not in pixels
 *
 */

class Map {
		
	/* Variables *************************************************************/

	var $table;							// Occupation map
	var $width;							// Width of the map (in units)
	var $height;						// Height of the map (in units)
	var $size;							// Size of the map (in square units)
	var $free_space;					// Free space (in square units)
	
	var $unite;							// Value of an unit (in pixels)
	
	var $result = array();				// Result array
	
	
	/**
	 * Initialistion
	 * @param	int			$unite		Unite size in px
	 * @param	int			$width		Map size in unit
	 * @param	int			$height		Map height in unit
	 * @return	Boolean					If success
	 */
	public function initialisation( $unite, $width, $height ) {
		
		// Sucurity tests
		if ( $width <= 0 && $height <= 0 && $unite <= 0 )
			return false;
		
		// Settings
		$this->width	= $width;
		$this->height	= $height;
		$this->unite	= $unite;
		
		// Get the size of the map
		$this->size			= $this->width * $this->height;
		$this->free_space	= $this->size;
		
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
	
	/**
	 * Basic check on values
	 * @param	int		$pos_x	Pos X in unit
	 * @param	int		$pos_y	Pos Y in unit
	 * @param	int		$width	Width in unit
	 * @param	int		$height	Height in unit
	 * @return	Boolean			True if the values are ok
	 */
	public function valuesCheck ($pos_x, $pos_y, $width, $height) {
		
		// Security tests
		// > Positions out of map or null sizes
		if ( $pos_x < 0 || $pos_y < 0 || $width <= 0 || $height <= 0 )
			return false;
			
		// > Overflow
		if (($pos_x + $width > $this->width) || ($pos_y + $height > $this->height))
			return false;
		
		// Everything is OK
		return true;
	}
	
	/**
	 * Check if a zone is free on the map
	 * @param	int		$pos_x	Pos X in unit
	 * @param	int		$pos_y	Pos Y in unit
	 * @param	int		$width	Width in unit
	 * @param	int		$height	Height in unit
	 * @return	Boolean			True if the values are ok
	 */
	public function placeCheck ($pos_x, $pos_y, $width, $height) {
		
		// Security tests
		if ( !$this->valuesCheck ($pos_x, $pos_y, $width, $height) )
			return false;
		
		// Treatment
		for ($i=0; $i<$width; $i++) {
		
			for ($j=0; $j<$height; $j++) {
				
				if ( $this->table[$pos_x + $i][$pos_y + $j] ) {
					return false; // This place is already taken
				} 
			}
		}
		
		// The place is free
		return true;
	}
	
	/**
	 * Method to put an image 
	 * @param	array	$pictureData	Object image 
	 * @param	int		$pos_x			Position on X where to put the image (in units)
	 * @param	int		$pos_y			Position on Y where to put the image (in units)
	 * @param	int		$width			Width of the place to put the image (in units)
	 * @param	int		$height			Height of the place to put the image (in units) 
	 * @param	boolean	$testr			Do we need to check if the place is free before to put the image ?
	 * @return	boolean					True if it's a success
	 */
	public function putImage (&$pictureData, $pos_x, $pos_y, $width, $height, $testr = false) {
		
		// Security tests
		if ( $testr ) {
			if ( !$this->placeCheck ($pos_x, $pos_y, $width, $height) )
				return false;
		}
		else {
			if ( !$this->valuesCheck ($pos_x, $pos_y, $width, $height) )
				return false;
		}
		
		// Treatement
		for ($i=0; $i<$width; $i++) {
		
			for ($j=0; $j<$height; $j++) {
				
				$this->table[$pos_x + $i][$pos_y + $j] = true;
			}
		}
		
		// Get the size of the image put in place
		$size = $width * $height;
		
		// Update the free space of the map
		$this->free_space -= $size;
		
		// Add this image in the result array
		$this->result[] = array(	'image' => $pictureData, 
									'pos_x' => ($pos_x * $this->unite), 
									'pos_y' => ($pos_y * $this->unite), 
									'width' => ($width * $this->unite), 
									'height' => ($height * $this->unite));
		
		// Update the image counter
		$pictureData->use_count--;
		
		// Everything is OK
		return true;
	}
	
	/**
	 * Method to find a place in this map
	 * You just have to give the width and height of the image to put in the map.
	 * It will return an array with the position availables
	 * @param	int		$width			Width of the place to put the image (in units)
	 * @param	int		$height			Height of the place to put the image (in units) 
	 * @return	array					List of free positions [{x(int), y(int)}]
	 */
	public function findPlace ($width, $height) {
		
		// Get the free space
		$free_space = $this->free_space;
		
		// Size of the element
		$element_size = $width*$height;
		
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
					if ($counter >= $height) 
						$current_col[] = $j-$height+1;
				}
			}
			
			$cols[] = $current_col;
		}
		
		// Check if the counter don't stop us
		if ( count($cols)<$width ) {
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
					if ($counter >= $width) 
						$combinaisons[] = array('y' => $i, 'x' => $j-$width+1);
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
	
	/**
	 * Method to get a random place in the map
	 * But warning, the place can be taken
	 * The setting are the dimensions of the image you want to put
	 * @param	int		$width			Width of the place to put the image (in units)
	 * @param	int		$height			Height of the place to put the image (in units) 
	 * @return	array					The random position {x(int), y(int)}
	 */
	public function getRandomPlace ( $width, $height ) {
		
		return array(	'x' => rand(0, $this->width - $width), 
						'y' => rand(0, $this->height - $height) );
	}

	/**
	 * Make the final rendering
	 * @param	int		$margin		Margin in pixel
	 * @return	string				HTML rendered
	 */
	public function rendering ($margin = 0) {

		$border = $margin;
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

			$html_content .= "<a href='".$current_img->attached."' rel='facebox'>";

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

	
	/* Debug *****************************************************************/

	/**
	 * Display the map in text on the output
	 */
	public function displayMap () {
	
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
}
