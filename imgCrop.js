/* EXAMPLE PLUGIN IMPLEMENTATION HERE

    $('.class-name').imgCrop({
        minWidth: 800,
        centerPercent: 50
    });

*/

(function($){
	"use strict";
    $.imgCrop = function(el, options, parameter){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        var cropped = false;
        var ratio, containerSize, marginLeft;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

		// no need to initiate plugin more than once
		if (base.$el.data("imgCrop") != undefined){
			return;
		}

        // Add a reverse reference to the DOM object
        base.$el.data("imgCrop", base);

        base.init = function(){
            if( typeof( parameter ) === "undefined" || parameter === null ) parameter = "value";
            base.parameter = parameter;
            base.options = $.extend({},$.imgCrop.defaultOptions, options);
            base.$baseImg = base.$el.find('img');
            // Put your initialization code here
            base.checkCrop();
        };

        $(window).resize(function(){
            base.checkCrop();
        });

        base.checkCrop = function(parameters){
            var curWidth = base.$el.width();
            if(curWidth < base.options.minWidth){
                var w = base.$baseImg.width();
                var h = base.$baseImg.height();
                ratio = h/w;
                containerSize = base.$el.width();
                base.stopCrop(ratio, containerSize);
            }else{
                base.revertCrop();
            };
        };
        base.stopCrop = function(ratio, container){
            if(!cropped){
                base.$baseImg.height(ratio*base.options.minWidth);
                base.$baseImg.width(base.options.minWidth);
                base.$baseImg.css('max-width', 'none');
                cropped = true;
            };
            marginLeft = (base.options.minWidth - container)*(base.options.centerPercent/100);
            base.$baseImg.css('margin-left', -marginLeft);

        };

        base.revertCrop = function(parameters){
            if(cropped){
                base.$baseImg.height('auto');
                base.$baseImg.width('100%');
                base.$baseImg.css('margin-left', '0px');
                cropped = false;
            };
        };
        // Run initializer
        base.init();
    };

    $.imgCrop.defaultOptions = {
        minWidth: 800,
        centerPercent: 50
    };

    $.imgCrop.methods = {
		doSomething: function(arg){
			var data = $(this).data('imgCrop');
			data.doSomethingInternal(arg);
		}
    };

    $.fn.imgCrop = function(options, parameter){
		// direct method calls ie. $('#id').imgCrop('doSomething',22);
		var args = arguments;
		return this.each(function(){
			if ($.imgCrop.methods[options]){
				return $.imgCrop.methods[options].apply(this, Array.prototype.slice.call( args, 1 ));
			}
			// regular initialization
			(new $.imgCrop(this,options, parameter));
		});
    };
})(jQuery);