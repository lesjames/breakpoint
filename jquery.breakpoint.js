/*!
 * jQuery Breakpoint plugin v4.4.0
 * http://github.com/lesjames/breakpoint
 *
 * MIT License
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {

        // AMD. Register as an anonymous module.
        define(['jquery', 'imagesloaded'], factory);

    } else {

        // in case imagesLoaded wasn't included
        var imagesLoaded = window.imagesLoaded || null;

        // Browser globals
        factory(jQuery, imagesLoaded);

    }
}(function ($, imagesLoaded) {

    // init vars
    // ==========================================================================

    var serial = 0,

        // defer setting any images until the breakpoint label
        // has been calculated the first time
        breakpointReady = $.Deferred(),
        ready = breakpointReady.promise(),

        // the current breakpoint and array
        breakpoint = {
            current: null,
            all: null,
            position: null
        };


    // breakpoint functions
    // ==========================================================================

    // increment the serial number
    function nextSerial() {
        serial += 1;
        return serial;
    }

    // finds the source of an image
    function setSource($image, prefix, breakpoint) {

        // find source by first trying the current breakpoint
        var src = $image.attr('data-' + prefix + breakpoint.current),
            i = breakpoint.position - 1;

        // if no match is found walk backwards through the
        // labels array until a matching data attr is found
        if (src === undefined) {
            for (i; i >= 0; i = i - 1) {
                src = $image.attr('data-' + prefix + breakpoint.all[i]);
                if (src !== undefined) {
                    break;
                }
            }
        }

        return src;
    }

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

        var oldBreakpoint = breakpoint.current,

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

        if (breakpointReady !== null) {

            // we have a label so make it safe to set the src of an image
            breakpointReady.resolve();
            breakpointReady = null;

        } else if (breakpoint.current !== oldBreakpoint) {

            // trigger breakpoint event if the breakpoint has changed
            $(document).trigger($.Event('breakpoint', { breakpoint: breakpoint }));

        }

        return breakpoint;

    }

    // callback and deferred execution
    function loadingComplete(proper, deferred, callback) {

        if (proper && imagesLoaded) {

            var load = imagesLoaded(proper);

            load.on('done', function ( instance ) {
                deferred.resolve( breakpoint, instance );
                if ( $.isFunction( callback ) ) {
                    callback.call( null, breakpoint, instance );
                }
            });

            load.on('fail', function ( instance ) {
                deferred.reject( breakpoint, instance );
            });

            load.on('progress', function( instance, image ) {
                deferred.notify( breakpoint, instance, image );
            });

        } else {

            // no images here or imagesLoaded isn't loaded,
            // just send back the breakpoint info
            deferred.resolve( breakpoint );
            if ( $.isFunction( callback ) ) {
                callback.call( null, breakpoint );
            }

        }

    }


    // bindings to update breakpoint
    // ==========================================================================

    // update the breakpoint on load
    $(document).ready(updateBreakpoint);

    // update the breakpoint on window resize
    $(window).on('resize.breakpoint', updateBreakpoint);


    // define the plugin
    // ==========================================================================

    $.fn.breakpoint = function (options, callback) {

        var setLength = this.length,
            processed = 0,
            proper = [],
            deferred = $.Deferred();

        // if callback passed as only argument
        if ( $.isFunction( options ) ) {
            callback = options;
            options = {};
        }

        // configure the options
        options = $.extend({
            delay : 200,
            prefix: '',
            fallback: null,
            fallbackSet: null,
            debug: false
        }, options || {});

        // for testing
        if (options.debug) {
            return {
                updateBreakpoint: updateBreakpoint,
                removeQuotes: removeQuotes
            };
        }

        // if applied to the document trigger callbacks
        if ( this[0] === document || !setLength ) {

            // make sure the breakpoint deferred is resolved first
            ready.done(function () {
                loadingComplete(null, deferred, callback);
            });

        } else {

            // loop though each image in set
            this.each(function() {

                var $image = $(this),
                    serial = $image.data('breakpoint-serial');

                // has this not yet been registered?
                if (!serial) {
                    serial = nextSerial();
                    $image.data('breakpoint-serial', serial);
                }

                // remove any previous handler
                $(document).off('breakpoint.serial' + serial);

                // create new handler
                $(document).on('breakpoint.serial' + serial, (function($image, options) {

                    var
                        // have we set the src at least once?
                        once = false,

                        // track our delay timeout
                        timeout = null;

                    function set(breakpoint) {

                        // init image source
                        var src = null;

                        // now we've processed this image at least once
                        once = true;

                        // logically, any timeout must be finished
                        timeout = null;

                        // check for breakpoint fallback
                        breakpoint.current = breakpoint.current || options.fallback;

                        // if label array is null then pull it from fallbackSet option
                        if (!breakpoint.all) {
                            breakpoint.all = options.fallbackSet;
                            breakpoint.position = breakpoint.all.length;
                        }

                        src = setSource($image, options.prefix, breakpoint);

                        if (src) {

                            // if we have a source set it
                            $image.attr('src', src);
                            proper.push($image[0]);

                        }

                        // count processed images
                        processed = processed + 1;

                        // if the whole set is processed, load the images
                        if (processed === setLength) {
                            loadingComplete(proper, deferred, callback);
                        }

                    }

                    // set the image once with the current breakpoint
                    // when the breakpoint is resolved
                    ready.done(function() {
                        set(breakpoint);
                    });

                    // return the event handler
                    return function(evt) {

                        // cancel any existing timeout
                        if (timeout !== null) {
                            clearTimeout(timeout);
                            timeout = null;
                        }

                        // run immediately or wait for resize delay?
                        if (!once || options.delay <= 0) {
                            set(evt.breakpoint);
                        } else {
                            timeout = setTimeout(function () {
                                set(evt.breakpoint);
                            }, options.delay);
                        }
                    };

                })($image, options));

            });

        }

        return deferred.promise( this );

    };

}));