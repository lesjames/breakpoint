/*!
 * jQuery Breakpoint plugin v4.3.0
 * http://github.com/lesjames/breakpoint
 *
 * Incorporated large portions of imagesloaded
 * http://github.com/desandro/imagesloaded
 *
 * MIT License
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    // init vars
    // ==========================================================================

    var
        serial = 0,
        rxQuotes = /('|"|\s+)/g,

        // defer setting any images until the breakpoint label
        // has been calculated the first time
        breakpointReady = $.Deferred(),
        ready = breakpointReady.promise(),

        // the current breakpoint and array
        breakpoint = null,
        labelArr = null,
        position = null;


    // breakpoint functions
    // ==========================================================================

    // increment the serial number
    function nextSerial() {
        serial += 1;
        return serial;
    }

    // grabs the breakpoint labels from the body's css generated content
    // triggers the event or promise to set the image's source
    function updateBreakpoint() {

        var currentBreakpoint = breakpoint,
            style = window.getComputedStyle && window.getComputedStyle(document.body, '::before'),
            labels = window.getComputedStyle && window.getComputedStyle(document.body, '::after');

        // modern browser can read the label
        if (style && style.content) {

            breakpoint = style.content;
            labels = labels.content;

            // remove quotes
            if (typeof breakpoint === 'string' || breakpoint instanceof String) {
                breakpoint = breakpoint.replace(rxQuotes, '');
            }
            if (typeof labels === 'string' || labels instanceof String) {
                labels = labels.replace(rxQuotes, '');
            }

            // convert label list into an array
            labelArr = labels.split(',');

            // find positon of current breakpoint in list of all breakpoints
            position = $.inArray(breakpoint, labelArr);

        }

        if (breakpointReady !== null) {

            // we have a label so make it safe to set the src of an image
            breakpointReady.resolve();
            breakpointReady = null;

        } else if (breakpoint !== currentBreakpoint) {

            // trigger breakpoint event if the breakpoint has changed
            $(document).trigger($.Event('breakpoint', { breakpoint: breakpoint }));

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

        var $this = this,
            deferred = $.Deferred(),
            $images = $this.find('img').add( $this.filter('img') ),
            loaded = [],
            proper = [],
            broken = [],
            skipped = [];

        // if callback passed as only argument
        if ( $.isFunction( options ) ) {
            callback = options;
            options = null;
        }

        // configure the options
        options = $.extend({
            delay : 200,
            prefix: '',
            fallback: null,
            fallbackSet: null
        }, options || { });


        // imagesloaded functions
        // ==========================================================================

        // when the image load event fires pass along the image and if there was an error
        function imgLoadedHandler( event ) {
            imgLoaded( event.target, event.type === 'error' );
        }

        function imgLoaded( img, isBroken, skip ) {

            // don't proceed if image is already loaded
            if ( $.inArray( img, loaded ) !== -1 ) {
                return;
            }

            // store element in loaded images array
            loaded.push( img );

            // keep track of broken and properly loaded images
            if ( isBroken ) {
                broken.push( img );
            } else if ( skip ) {
                skipped.push( img );
            } else {
                proper.push( img );
            }

            // cache image and its state for future calls
            $.data( img, 'imagesLoaded', { isBroken: isBroken, src: img.src } );

            // trigger deferred progress method
            deferred.notify( img, isBroken, loaded.length, $images.length );

            // call doneLoading and clean listeners if all images are loaded
            if ( $images.length === loaded.length ) {
                setTimeout( doneLoading );
                $images.unbind( '.imagesLoaded', imgLoadedHandler );
            }

        }

        function doneLoading() {

            // each call to breakpoint returns a data object for that set of images
            // you get the current breakpoint information and info about the images
            // in the set, if they were loaded, broken or skipped because of no source

            var data = {
                breakpoint: {
                    current: breakpoint,
                    all: labelArr,
                    position: position
                },
                images: {
                    all: loaded,
                    broken: broken,
                    skipped: skipped,
                    proper: proper
                }
            };

            if ( broken.length ) {
                deferred.reject( data );
            } else {
                deferred.resolve( data );
            }

            if ( $.isFunction( callback ) ) {
                callback.call($this, data);
            }
        }


        // images loaded event
        // ==========================================================================

        // if no images or if applied to the document trigger immediately
        if ( !$images.length || $this[0] === document ) {
            ready.done(doneLoading);
        } else {

            // bind the imagesLoaded event to images and then run breakpoint on each on
            $images.on( 'load.imagesLoaded error.imagesLoaded', imgLoadedHandler ).each(function () {

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
                        breakpoint = breakpoint || options.fallback;

                        // if label array is null then pull it from fallbackSet option
                        if (!labelArr) {
                            labelArr = options.fallbackSet;
                            position = labelArr.length;
                        }

                        src = (function () {

                            // find source by first trying the current breakpoint
                            var src = $image.attr('data-' + options.prefix + breakpoint),
                                i = position - 1;

                            // if no match is found walk backwards through the
                            // labels array until a matching data attr is found
                            if (src === undefined) {
                                for (i; i >= 0; i = i - 1) {
                                    src = $image.attr('data-' + options.prefix + labelArr[i]);
                                    if (src !== undefined) {
                                        break;
                                    }
                                }
                            }

                            return src;
                        }());

                        if (src) {

                            // if we have a source set it
                            $image.attr('src', src);

                        } else {

                            // if no source is found we need to skip this
                            // image and not reject the deferred
                            imgLoaded($image[0], false, true);

                        }

                    }

                    // set the image once with the current breakpoint
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

        // return promise
        return deferred.promise( $this );
    };

}));