/*!
 * jQuery Breakpoint plugin v4.4.0
 * http://github.com/lesjames/breakpoint
 *
 * MIT License
 */

(function (factory) {

    if (typeof define === 'function' && define.amd) {

        // AMD. Register as an anonymous module.
        define(['jquery', 'imagesloaded', 'eventEmitter'], factory);

    } else {

        // in case dependencies aren't included
        var imagesLoaded = window.imagesLoaded || null;

        // Browser globals
        factory(jQuery, imagesLoaded, window.EventEmitter);

    }

}(function ($, imagesLoaded, EventEmitter) {

    // breakpoint functions
    // ==========================================================================

    // some browsers add quotes to the value from css generated content
    function removeQuotes(string) {
        var rxQuotes = /('|"|\s+)/g;
        if (typeof string === 'string' || string instanceof String) {
            string = string.replace(rxQuotes, '');
        }
        return string;
    }

    // grabs the breakpoint labels from the body's css generated content
    // triggers the event or promise to set the image's source
    function updateBreakpoint() {

        var breakpoint = {},

            // grab values from css generated content
            style = window.getComputedStyle && window.getComputedStyle(document.body, '::before'),
            labels = window.getComputedStyle && window.getComputedStyle(document.body, '::after');

        // modern browser can read the label
        if (style && style.content) {

            breakpoint.current = removeQuotes(style.content);
            breakpoint.all = removeQuotes(labels.content);

            // convert label list into an array
            breakpoint.all = breakpoint.all.split(',');

            // find positon of current breakpoint in list of all breakpoints
            breakpoint.position = $.inArray(breakpoint.current, breakpoint.all);

        }

        return breakpoint;

    }

    // finds the source of an image
    function findSource($image, set) {

        // find source by first trying the current breakpoint
        var src = $image.attr('data-' + set.options.prefix + set.breakpoint.current),
            i = set.breakpoint.position - 1;

        // if no match is found walk backwards through the
        // labels array until a matching data attr is found
        if (src === undefined) {
            for (i; i >= 0; i = i - 1) {
                src = $image.attr('data-' + set.options.prefix + set.breakpoint.all[i]);
                if (src !== undefined) {
                    break;
                }
            }
        }

        return src;
    }

    function setSource($image, set) {

        var hasSource = false,
            src = findSource($image, set);

        if (src) {
            $image.attr('src', src);
            hasSource = true;
        }

        return $image;

    }

    // callback and deferred execution
    function breakpointComplete(set) {

        if (imagesLoaded && set.selection.length > 0) {

            var load = imagesLoaded(set.selection);

            load.on('done', function ( instance ) {
                set.dfd.resolve( set.breakpoint, instance );
                if ( $.isFunction( set.callback ) ) {
                    set.callback.call( null, set.breakpoint, instance );
                }
            });

            load.on('fail', function ( instance ) {
                set.dfd.reject( set.breakpoint, instance );
            });

            load.on('progress', function( instance, image ) {
                set.dfd.notify( set.breakpoint, instance, image );
            });

        } else {
            // no images here or imagesLoaded isn't loaded,
            // just send back the breakpoint info
            set.dfd.resolve( set.breakpoint );
            if ( $.isFunction( set.callback ) ) {
                set.callback.call( null, set.breakpoint );
            }

        }

    }


    // Set of Breakpoint images
    // ==========================================================================

    function BreakpointSet( selection ) {
        this.selection = selection;
    }

    BreakpointSet.prototype = new EventEmitter();

    BreakpointSet.prototype.options = {
        delay : 200,
        prefix: '',
        fallback: null,
        fallbackSet: null,
        debug: false
    };

    BreakpointSet.prototype.callback = null;

    BreakpointSet.prototype.processImages = function () {

        var set = this;

        if (set.selection.length > 0) {
            set.selection.each(function () {
                setSource( $(this), set );
            });
        }

        breakpointComplete(set);

    };

    // define the plugin
    // ==========================================================================

    $.fn.breakpoint = function (options, callback) {

        // if callback passed as only argument
        if ( $.isFunction( options ) ) {
            callback = options;
            options = {};
        }

        var breakpointSet = new BreakpointSet( this );
        breakpointSet.dfd = $.Deferred();
        breakpointSet.options = $.extend({}, breakpointSet.options, options);
        breakpointSet.callback = callback;
        breakpointSet.breakpoint = updateBreakpoint();

        breakpointSet.processImages();

        if (breakpointSet.options.debug) {
            return {
                breakpointSet: breakpointSet,
                removeQuotes: removeQuotes,
                updateBreakpoint: updateBreakpoint,
                findSource: findSource,
                setSource: setSource
            };
        } else {
            return breakpointSet.dfd.promise();
        }

    };

}));