(function($){

    $.fn.breakpoint = function(options) {

        var resizeTimeout,
            that = this,
            currentLabel,
            settings = $.extend({
                'delay' : 200,
                'callback' : function(){},
                'prefix' : 'data-',
                'fallback' : 'mobile'
            }, options),
            findLabel = function(){
                // grab the current breakpoint label
                var label = $('head').css('font-family');
                return label;
            },
            searchArr = function(arr, label) {
                // does our source array have a match for our label?
                for (var i=0; i<arr.length; i++) {
                    var s = '^' + settings.prefix + label + '$';
                    if (arr[i].match(s)) return true;
                }
                return false;
            },
            findSource = function(){
                // looks at image element and builds array of available sources
                var arr = [];
                for(var i = 0; i < this.attributes.length; i++) {
                    var s = this.attributes[i].nodeName;
                    var r = '^' + settings.prefix;
                    if (s.match(r)) arr.push(s);
                }
                return arr;
            },
            setSource = function(){
                // what is our breakpoint label?
                var label = findLabel();

                // should only fire if a change was made
                if (label !== currentLabel) {
                    that.each(function(){

                        // does the element have a matching src for our label?
                        var srcArr = findSource.call(this),
                            arrMatch = searchArr(srcArr, label),
                            src;

                        // if we don't have a matching src then use the fallback
                        (arrMatch) ? src = $(this).attr(settings.prefix + label) : src = $(this).attr(settings.prefix + settings.fallback);

                        // create a src for the image
                        $(this).attr('src', src);

                    });
                    // set current label
                    currentLabel = label;
                    
                    // if a callback was set then fire it once
                    settings.callback();
                }
            };

        // resize the image on window resize with a delay
        $(window).bind('resize.breakpoint', function(){
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setSource, settings.delay);
        });

        // init
        return that.each(setSource);

    }
})(jQuery);