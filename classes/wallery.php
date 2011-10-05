<?

class Wallery {
		
	/*	Classe wallery
		This class content all the informations and algorithms about a wall
		
		WARNING :
		The image database need an image with the dimensions of 1x1 unit
		
	*/
	
	
	// Variables
	var $imagesBase = null; 		// Image dataBase
	var $map = null; 				// the Map
	
	var $unite = 0;					// Block size (in pixels)	
	var $border = 0;				// Border of a bloc (in pixels)	
	var $map_width_px = 0;			// Width of the map (in pixels)
	var $map_height_px = 0;			// Height of a map (in pixels)
	
	var $marge = 0;					// % of free space in the generated map
	var $nb_tentative_rand = 5;		// Number of try to find a place
	var $isGenerated = false;		// Is the current wallery is generated or not
	
	
	// Initialistion
	function initialisation( $pDataImages, $pUnite, $pMapWidth, $pMapHeight, $pBorder = 2 ) {
		
		// Tests
		if (!is_array($pDataImages) || count($pDataImages)==0) {
			return false;
		}
		
		if ($pUnite <= 0 || $pBorder < 0) {
			return false;
		}
		
		if ($pUnite > $pMapWidth || $pUnite > $pMapHeight) {
			return false;
		}
		
		// Everything is OK
		$this->imagesBase 			= $pDataImages;
		$this->unite				= $pUnite;
		$this->border				= $pBorder;
		$this->map_width_px 		= $pMapWidth;
		$this->map_height_px 		= $pMapHeight;
		
		$this->isGenerated			= false;
		
		// Map creation
		$map_width_unit = ceil( $pMapWidth/$pUnite );
		$map_height_unit = ceil( $pMapHeight/$pUnite );
		
		$this->map = new Map ();	
		$this->map->initialisation( $pUnite, $map_width_unit, $map_height_unit );	
		
		return true;
	}
	
	
	// Setter for the try level
	function set_motor_level ($pLevel) {
		
		if ($pLevel >= 0) {
			
			$this->nb_tentative_rand = $pLevel;
			return true;
		} else {
		
			return false;
		}
	}
	
	
	// Setter for the percent of free space in the generated final map
	function set_final_free_space ($pFFS) {
		
		if ($pFFS >= 0 && $pFFS <= 100) {
			
			$this->marge = $pFFS;
			return true;
		} else {
		
			return false;
		}
	}
	
	
	// Generate wall
	///////////////////////////////////////////////////////////////////////////////
	function generate ($pRender = false) {
	
		// Tests
		if ($this->map == null) {
			return false;
		}
	
		// Treatement of images and fill the Album
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		$album = new Album();
		$album->initialisation( $this->unite );
		
		foreach ($this->imagesBase as $images) {
			
			// Creation of the object Image and adding in the Album
			$image = new Image();
			if ($image->initialisation( $images[0], $images[1], $images[2], $images[3] ))
				$album->add_image($image);
		
		}
		
		// Sort the album (descending)
		$album->sort_it();
		
		
		// Get the number of displaying of each image
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		
		$nb_aff = ceil( $this->map->size * (($this->unite - $this->marge) / $this->unite) / $album->size ) - 1;
		
		for ($i=0; $i<count( $album->portfolio ); $i++) {
			$album->portfolio[$i]->use_count = $nb_aff;
		}
		
		
		// We begin to put image in the map
		////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		
		// Premier traitement
		for ($i=0; $i<count( $album->portfolio ); $i++) {
			
			
			// Get the image to put
			$current_img = $album->portfolio[$i];
			
			// Number of try (for the random solution)
			$nb_try = $current_img->use_count;
			
			while ( $current_img->use_count != 0) {
				
				// Random test to find a place on the map
				$is_placed = false;
				
				while ( !$is_placed && ($nb_try > 0) ) {
					
					$nb_try--;
					$position_to_try = $this->map->get_random_place( $current_img->width_unit, $current_img->height_unit );
					$is_placed = $this->map->place_check(	$position_to_try['x'], 
															$position_to_try['y'], 
															$current_img->width_unit, 
															$current_img->height_unit);
				}
				
				// If place has been find we put the image
				// Else we try manually (but it need more ressources and time)
				if ($is_placed) {
					
					$this->map->put_image(	$current_img, 
											$position_to_try['x'], 
											$position_to_try['y'], 
											$current_img->width_unit, 
											$current_img->height_unit );
					
				} else {
				
					// In this case the random case hasn't been nice with us
					// => We gonna find a place manually
					$last_chance = $this->map->find_place( $current_img->width_unit, $current_img->height_unit );
					
					if ($last_chance) {
					
						$the_one = rand(0, count($last_chance)-1);
						$this->map->put_image( 	$current_img, 
												$last_chance[$the_one]['x'], 
												$last_chance[$the_one]['y'], 
												$current_img->width_unit, 
												$current_img->height_unit);
											
					} else {
					
						$current_img->use_count = 0;
					}
				}
			}
		}
		
		
		// Basically, we just have to fill the blank
		$position_start = 0;
		$limit_free_space = ceil($this->map->size * ($this->marge/$this->unite));
		$i=0;
		
		while ( $this->map->free_space >= $limit_free_space  &&  $position_start < count($album->portfolio) ) {
			
			// Récupération de l'image a placer
			$current_img = $album->portfolio[$i];
			
			// In this case the random case hasn't been nice with us
			// => We gonna find a place manually
			$last_chance = $this->map->find_place( $current_img->width_unit, $current_img->height_unit );
			
			if ($last_chance) {
			
				$the_one = rand(0, count($last_chance)-1);
				
				// Random funtion
				$imageDisplayed = $album->portfolio[rand(0, $i)];
				while ($imageDisplayed->width_unit < $current_img->width_unit || $imageDisplayed->height_unit < $current_img->height_unit) {
					$imageDisplayed = $album->portfolio[rand(0, $i)];
				}
				
				$this->map->put_image( 	$imageDisplayed, 
										$last_chance[$the_one]['x'], 
										$last_chance[$the_one]['y'], 
										$current_img->width_unit, 
										$current_img->height_unit);
			} else {
			
				$position_start = $i + 1;
			}
			
			if ( $i + 1 == count($album->portfolio) ) {
				$i = $position_start;
			} else {
				$i++;
			}
			
		}
		
		
		// Final step
		$this->isGenerated = true;
		
		if ($pRender) {
			return $this->rendering();
		} else {
			return true;
		}
		
		
	}
	
	// Rendering of the wall
	///////////////////////////////////////////////////////////////////////////////
	function rendering () {
	
		if ($this->isGenerated) {
			return $this->map->rendering( $this->border );
		}
	}
	
	
}

?>