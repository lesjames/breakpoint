// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

// ==========================================================================
// Responsive Grid Hook and Image Loading
// ==========================================================================

// Grid Conditionals
function gridLogic() {
    // find grid size
    var label = $('head').css('font-family');
        
    // do something with the grid size
    if (label === 'no-support') {
        // no media query support
        responsiveImage('desktop');
    } else if (label === 'mobile' || label === 'tablet' || label === 'desktop') {
        // grid is fluid
        responsiveImage(label);
    } else {
        // something failed (Opera will fail)
        responsiveImage('desktop');
    }
}

// loop though all responsive images on page
function responsiveImage(s) {
    $('.responsive-image').each(function(){
        var src = $(this).attr('data-'+ s);
        $(this).attr('src', src);
    });
}

// init grid hook
gridLogic();

var gridTimeout;
// bind grid hook to window resize
$(window).bind('resize.grid', function(){
    clearTimeout(gridTimeout);
    gridTimeout = setTimeout('gridLogic()', 200);
});