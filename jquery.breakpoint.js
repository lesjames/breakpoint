/* jshint strict:false */
/* global jQuery:true */

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


    // functions
    // ==========================================================================

    // increment the serial number
    function nextSerial() {
        serial += 1;
        return serial;
    }

    // searches label array for current breakpoint and returns position
    function searchArr(arr, string) {
        for (var j = 0; j < arr.length; j++) {
            if (arr[j].match(string)) { return j; }
        }
        return -1;
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
            position = searchArr(labelArr, breakpoint);

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


    // bindings
    // ==========================================================================

    // update the breakpoint on load
    $(document).ready(updateBreakpoint);

    // update the breakpoint on window resize
    $(window).on('resize.breakpoint', updateBreakpoint);


    // define the plugin
    // ==========================================================================

    $.fn.breakpoint = function (options, callback) {

        // if callback passed as only argument
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        // configure the options
        options = $.extend({
            delay : 200,
            prefix: '',
            fallback: null
        }, options || { });

        // for each image in set
        this.each(function () {

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

                    // resolve the breakpoint
                    breakpoint = breakpoint || options.fallback;

                    // bail out if we appied breakpoint to the document
                    if ($image[0] === document && typeof callback === 'function') {

                        callback.call(null, {
                            breakpoint: breakpoint,
                            list: labelArr,
                            position: position
                        });

                        return;
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

                    // if we have a source, set it
                    if (src) {
                        $image.attr('src', src);
                    }

                    // fire callback
                    if (typeof callback === 'function') {
                        callback.call($image, breakpoint, src);
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

        // now that we have some images, update the breakpoint
        // to give them a chance to set their images
        updateBreakpoint();

        // for chaining
        return this;
    };

}));