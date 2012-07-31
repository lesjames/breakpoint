// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

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