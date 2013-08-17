/**
 * AirportText
 * jQuery Plugin
 *
 * Made to display text with transition
 * With an effect of airport display
 *
 * types : 	simple	> 		simple recreation
 *			progressif >	make the letter turning a lot of time before display them
 *			full >			begin by full the text area and let the letters turn before final display	 
 *
 *
 * WARNING: This class is made to work only on DOM element who contain text only.
 * No tag BR will be taken in charge
 */

(function($){


	/**
	 * AirportText
	 * Class definition 
	 * 
	 */
	var AirportText = function (pElement, pType, pInterval, pDelay) {
    	this.object    		= pElement;
    	this.counter   		= - Math.round(pDelay / pInterval);
    	this.originalText   = $(pElement).text();
    	this.intervalObj	= setInterval( jQuery.proxy(this, 'updateDisplay'), pInterval );
    	this.type 			= pType;

    	$(pElement).text("_");
	}


	/**
	 * updateDisplay
	 * Script applied at every interval 
	 * 
	 */
	AirportText.prototype.updateDisplay = function () {

		// Increase the counter
		this.counter += 1;

		if (this.counter < 0) {
			
			// Wait to be ready
			return null;
		}
		else if (this.counter > this.originalText.length) {

			// Kill object
			this.object.text( this.originalText ).animate({minHeight: 0}, 200);
			clearInterval(this.intervalObj);
			return null;
			
		}

		switch (this.type) {

			case "simple": 
				this.object.text( this.originalText.substr(0, this.counter) + "_" );
				break;

			case "progressif":
				var randomLength = (this.counter > 5) ? 5 : this.counter;
				randomLength = (randomLength + this.counter > this.originalText.length) ? this.originalText.length - this.counter : randomLength;
				this.object.text( this.originalText.substr(0, this.counter) + getRandomWord(randomLength) );
				break;

			case "full":
				var randomLength = (this.counter * 4 > this.originalText.length) ? this.originalText.length - this.counter : this.counter * 3;
				this.object.text( this.originalText.substr(0, this.counter) + getRandomWord(randomLength) );
				if (Math.random() > 0.4) this.counter -= 1;
				break;
		}

		// Update the min-height
		var minHeight 	= parseInt(this.object.css('minHeight'));
			height 		= this.object.height();

		if (minHeight < height) this.object.css('minHeight', height + 'px');
	}


	/**
	 * airportText plugin definition
	 *
	 * @param	pType		string 	Type of the effect (restart, progressif, simplepass)
	 * @param	pInterval	int 	Number of seconds between each letter displaying
	 * @param	pDelay 		int 	Delay before to begin the effect (default : 0)
	 * @return 				bool	Succes of the method
	 */
	$.fn.airportText = function( pType, pInterval, pDelay ) {

		// Tests //////////////////////////////////////////
		if (this.text() == "") {
			// Text is empty
			return false;
		}

		if (pType != 'simple' && pType != 'progressif' && pType != 'full') {
			console.log("airportText::type '"+ pType +" dosen't exists.");
			return false;
		}

		if (pInterval == undefined) {
			console.log("airportText::constructor pInterval is not set correctly.");
			return false;
		}

		if (pDelay == undefined) {
			pDelay = 0;
		}

		// Treatment //////////////////////////////////////
		new AirportText(this, pType, pInterval, pDelay);
		return true;
	};


})(jQuery);



/**
 * getRandomWord
 * Get a random word (in lowercase)
 * 
 * @param	pLength	int 	Length of the random word
 * @return 			string 	Random word
 */
function getRandomWord (pLength) {

	var toReturn = "";
	var charList = "abcdefghijklmnopqrstuvwxyz0123456789 _*%!?/\\|#@";

	// Param tests
	if (pLength <= 0) {
		return toReturn;
	}

	// Generate word
	for(var i = 0; i < pLength; i++) {

		toReturn += charList.charAt(Math.floor(Math.random() * charList.length));
	}

	return toReturn;
}