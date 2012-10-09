(function($){

    // TODO: turn arguments into options object

    $.fn.breakpoint = function(callback, delay) {
    
        var resizeTimeout,
            that = this,
            currentLabel,
            delay = delay || 200,
            callback = callback || {},
            findLabel = function(){

                // grab the current breakpoint label
                var label = $('head').css('font-family');

                // fallback for no mq support
                if (label === 'no-support') { label = 'mobile'; }    
                
                return label;                
            
            },
            setSource = function(){
                
                var label = findLabel();
                
                // should only fire if a change was made                
                if (label !== currentLabel) {
                                        
                    // find the source we need for this layout
                    var src = $(this).attr('data-' + label);
                    
                    // create source
                    $(this).attr('src', src);
                    
                    // set current label
                    currentLabel = label;
                    
                    callback();
            
                }
                                
            };

        // resize the image on window resize with a delay
        $(window).bind('resize.breakpoint', function(){
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function(){ setSource.call(that); }, delay);
        });
        
        // init
        return this.each(setSource);
    
    }
})(jQuery);