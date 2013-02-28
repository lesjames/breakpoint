/*global Modernizr:true */

// Analytics
// =============================================================================

var _gaq = _gaq || [],
    _gaBounce;

// standard account tracking declared domain capabilities
_gaq.push(['_setAccount', 'UA-XXXXXXXX-X']);
_gaq.push(['_setDomainName', 'example.com']);

// deliver pageview data after assembling the _gaq
_gaq.push(['_trackPageview']);

// 15-second bounce rate timer
_gaBounce = setTimeout(function () {
    _gaq.push(['_trackEvent', '15_seconds', 'read']);
}, 15000);

// ga init
(function() {

    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

})();


// Box sizing
// =============================================================================

if (Modernizr.boxsizing !== null && Modernizr.boxsizing === false) {

    $.fn.boxSizeIE7 = function() {
        this.each(function() {
            var $this = $(this),
                elem_width = $this.width();
            $this.width(elem_width - ($this.outerWidth() - elem_width));
        });
    };

    // add more selectors here for box sizing fixes
    $('.grid__cell').boxSizeIE7();
}


// Console helper for older browsers
// =============================================================================

(function() {
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = window.console || {};

    while (length--) {
        // Only stub undefined methods.
        console[methods[length]] = console[methods[length]] || noop;
    }
}());