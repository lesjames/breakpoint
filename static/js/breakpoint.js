(function($){

    $.fn.breakpoint = function(options) {

        var resizeTimeout,
            that = this,
            currentLabel,
            settings = $.extend({
                'delay' : 200,
                'callback' : function(){},
                'prefix' : 'data-',
                'fallback' : 'desktop',
                'fallbackSrc' : null,
                'debug' : false
            }, options),
            findLabel = function(){
                // grab the current breakpoint label
                var label = (window.getComputedStyle) ? getComputedStyle(document.body, '::before')['content'] : settings.fallback;
                // remove any quotes from string
                label = label.replace(/['"]/g,'');
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
                        label = (arrMatch) ? label : settings.fallback;
                        src = $(this).attr(settings.prefix + label);                      
                        
                        // pull the fallback src if no label is found
                        if (src === undefined) { src = settings.fallbackSrc; }
                        // if something crashed and burned
                        if (src === null) { console.warn('Breakpoint warning: there is no fallback attr or src set for '+ settings.fallback) }
                        
                        // create a src for the image
                        $(this).attr('src', src);

                    });
                    // set current label
                    currentLabel = label;

                    // if a callback was set then fire it once
                    settings.callback();                
                }
            };
        
        // create global object with copies of plugin functions for testing
        if(settings.debug) {
            breakpoint = {};
            breakpoint.findLabel = findLabel;
            breakpoint.searchArr = searchArr;
            breakpoint.findSource = findSource;
            breakpoint.setSource = setSource;
        }
        
        // resize the image on window resize with a delay
        $(window).bind('resize.breakpoint', function(){
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setSource, settings.delay);
        });

        // init
        return that.each(setSource);

    }
})(jQuery);