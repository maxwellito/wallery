<?

/**
 * Class Album
 * This class contain the list of images to display in the map.
 * It can evolve te can contain more information about pictures.
 * Basically, it's just a big Array.
 * But it's cleaner..
 * 
 */

class Album {
		
	/* Variables *************************************************************/

	var $portfolio;							// the 'Array' (aka Library)
	
	var $unite;								// Unity (in pixels)
	var $size;								// Size/length of the album
	var $is_sorted;							// Boolean to know if the album is sorted
	 
	
	/**
	 * Initialisation
	 * @param	int		$unite	Unite in pixels
	 * @return	boolean			True if it's ok
	 */
	public function initialisation( $unite ) {
		
		// Test
		if ( $unite <= 0 )
			return false; 
		
		$this->unite = $unite;
		$this->size = 0;
		$this->is_sorted = true;
		
		// Initialisation
		$this->portfolio = array();
		
		// Everything is OK
		return true;
	}
	
	/**
	 * To add an image in the album
	 * @param	image object	$image	Image object to add in the collection
	 */
	public function addImage ( &$image ) {
		
		// Security test
		if ( !$image->update_unite($this->unite) )
			return false;
		
		// Add the picture in the library
		$this->portfolio[] = $image;
		
		// Album update
		$this->is_sorted = false;
		$this->size += $image->size;
		
		// Everything is OK
		return true;
	}
	
	/**
	 * Sort images in the order for a future treatment
	 */
	public function sortIt () {
		
		// Picture sort
		$images_temp = array();
		$images_sort = array();
		
		for ($i=0; $i<count($this->portfolio); $i++) {
			
			$images_temp[$i] = $this->portfolio[$i]->size;
		}
		
		// Sort the temp array
		arsort($images_temp);
		
		foreach ($images_temp as $key => $val) {
		    $images_sort[] = $this->portfolio[$key];
		}
		
		// Put the sorted array
		$this->portfolio = $images_sort;
			
		// Update the album state
		$this->is_sorted = true;
	}
	
	
	/* Debug *****************************************************************/

	/**
	 * Display an album information
	 * @param	string	$prefix		Prefix before the display of each line
	 */
	public function display ( $prefix = "" ) {
	
		printf("%sClass Album<br>",	$prefix);
		printf("%sunite : %d<br>",	$prefix, $this->unite);
		printf("%ssize : %d<br>",	$prefix, $this->size);
		
		// Display all the informations of the images in the library
		for ($i=0; $i<count($this->portfolio); $i++) {
			
			$this->portfolio[$i]->display("    ");
		}
	}	
}
