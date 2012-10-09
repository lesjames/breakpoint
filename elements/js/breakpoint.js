(function($){

    $.fn.breakpoint = function(options) {
    
        var resizeTimeout,
            that = this,
            currentLabel,
            settings = $.extend({
                'delay' : 200,
                'callback' : function(){},
                'attrPrefix' : 'data-',
                'fallback' : 'mobile'
            }, options),
            findLabel = function(){
                // grab the current breakpoint label
                var label = $('head').css('font-family');
                return label;                
            },
            searchArr = function(stringArray, label) {
                for (var j=0; j<stringArray.length; j++) {
                    var s = '^' + settings.attrPrefix + '' + label + '$';
                    if (stringArray[j].match(s)) return true;
                }
                return false;
            },
            findSource = function(){
                // looks at image and builds arr of available sources
                var sourceArr = [];
                for(var i = 0; i < this.attributes.length; i++) {
                    var s = this.attributes[i].nodeName;
                    var r = '^' + settings.attrPrefix;
                    if (s.match(r)) sourceArr.push(s);
                }
                return sourceArr;
            },
            setSource = function(){
                var label = findLabel();
                
                // should only fire if a change was made                
                if (label !== currentLabel) {     
                    that.each(function(){                    
                        
                        // find available data src
                        var srcArr = findSource.call(this),
                            arrMatch = searchArr(srcArr, label),
                            src;
                        
                        // if we don't have a matching src then use the fallback                      
                        (arrMatch) ? src = $(this).attr(settings.attrPrefix + label) : src = $(this).attr(settings.attrPrefix + settings.fallback);
                        
                        // create a src for the image
                        $(this).attr('src', src);
                        
                    });
                    // set current label
                    currentLabel = label;
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