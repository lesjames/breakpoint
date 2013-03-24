/*global Modernizr:true */

// Box sizing
// =============================================================================
Modernizr.addTest("boxsizing", function() {
    return Modernizr.testAllProps("boxSizing") && (document.documentMode === undefined || document.documentMode > 7);
});

if (!Modernizr.boxsizing) {

    $.fn.boxSizeIE7 = function() {
        this.each(function() {
            var $this = $(this);
            $this.width($this.width()*2 - $this.outerWidth());
        });
    };

    // add more selectors here for box sizing fixes
    $('.grid__cell').boxSizeIE7();
}


// Console helper for older browsers
// =============================================================================

(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());