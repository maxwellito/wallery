/**
 * Wallery class
 * jQuery plugin to control the 4 maps
 * and simulate the wallery
 * 
 *
 * Options:
 *	navigation:		string		border|drag
 *	dev:			boolean		false
 *	click:			function	null
 *
 */

(function($){

	$.fn.extend({

		//plugin name
		wallery: function(options) {

			//Settings list and the default values
			var defaults = {
				navigation:		'drag',
				intro:			true,
				dev:			false,
				click:			null
			};

			options = $.extend(defaults, options);

			return this.each(function() {

				var opt = options;
				opt.el = this;

				new Wallery(opt).start();

			});
		}
	});

})(jQuery);