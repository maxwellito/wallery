<?

class Album {
		
	/*	Class Album
		This class contain the list of images to display in the map.
		It can evolve te can contain more information about pictures.
		Basically, it's just a big Array.
		But it's cleaner..
	*/
	
	
	// Variables
	var $portfolio;							// the 'Array' (aka Library)
	
	var $unite;								// Unity (in pixels)
	var $size;								// Size/length of the album
	var $is_sorted;							// Boolean to know if the album is sorted
	 
	
	// Initialistion
	function initialisation( $pUnite ) {
		
		// Test
		if ( $pUnite <= 0 )
			return false; 
		
		$this->unite = $pUnite;
		$this->size = 0;
		$this->is_sorted = true;
		
		// Initialisation
		$this->portfolio = array();
		
		// Everything is OK
		return true;
	}
	
	
	// Add a image
	///////////////////////////////////////////////////////////////////////////////
	function add_image ( &$pImage ) {
		
		// Security test
		if ( !$pImage->update_unite($this->unite) )
			return false;
		
		// Add the picture in the library
		$this->portfolio[] = $pImage;
		
		// Album update
		$this->is_sorted = false;
		$this->size += $pImage->size;
		
		// Everything is OK
		return true;
	}
	
	
	// Sort method
	///////////////////////////////////////////////////////////////////////////////
	function sort_it () {
		
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
	
	
	// Display (debug function)
	///////////////////////////////////////////////////////////////////////////////
	function display ( $pPre = "" ) {
	
		printf("%sClass Album<br>",	$pPre);
		printf("%sunite : %d<br>",	$pPre, $this->unite);
		printf("%ssize : %d<br>",	$pPre, $this->size);
		
		// Display all the informations of the images in the library
		for ($i=0; $i<count($this->portfolio); $i++) {
			
			$this->portfolio[$i]->display("    ");
		}
	}
	
	
}

?>