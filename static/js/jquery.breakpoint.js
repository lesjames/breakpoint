(function($, window, document){

    var
        // regex to strip quotes around the breakpoint label
        rxQuotes = /^('|")|('|")$/g,

        // defer setting any images until the breakpoint label
        // has been calculated the first time
        breakpointReady = $.Deferred(),
        ready = breakpointReady.promise(),

        // the current serial number
        serial = 0,

        // the current breakpoint label
        breakpoint = null,

        // a utility for converting arguments to an Array
        rest = function(args, nth) {
            var values = [],
                length = args.length,
                i = nth || 0;
            for ( ; i < length; i++) {
                values.push(args[i]);
            }
            return values;
        },

        // a utility for currying function arguments
        partial = function(fn) {
            return (function(fn, args) {
                return function() {
                    return fn.apply(null, args.concat(rest(arguments)));
                }
            })(fn, rest(arguments, 1));
        },

        // generate the next serial number
        nextSerial = function() {
            serial += 1;
            return serial;
        },

        // update the current breakpoint label and dispatch
        // the breakpoint event if it has changed
        updateBreakpoint = function() {

            var currentBreakpoint = breakpoint,
                style = window.getComputedStyle && window.getComputedStyle(document.body, "::before");

            if (style) {
                breakpoint = style["content"] || null;
                if (typeof breakpoint === "string" || breakpoint instanceof String) {
                    breakpoint = breakpoint.replace(rxQuotes, "");
                }
            }

            // fulfill the promise or dispatch an event?
            if (breakpointReady !== null) {

                breakpointReady.resolve();
                breakpointReady = null;

            } else if (breakpoint !== currentBreakpoint) {

                $("body").trigger($.Event("breakpoint", { breakpoint: breakpoint }));
            }
        };

    // update the breakpoint on load
    $(document).ready(updateBreakpoint);

    // update the breakpoint on window resize
    $(window).bind("resize.breakpoint", updateBreakpoint);

    // define the plugin
    $.fn.breakpoint = function(options) {

        this.each(function() {

            var image = $(this),
                serial = image.data("breakpoint-serial");

            // has this not yet been registered?
            if (!serial) {
                serial = nextSerial();
                image.data("breakpoint-serial", serial);

                // be a good memory citizen
                $(document).bind("unload.breakpoint.serial" + serial, partial(function(image, serial) {

                    // unbind our closures so garbage collection can happen
                    image.unbind("breakpoint.serial" + serial);
                    $(this).unbind("unload.breakpoint.serial" + serial);
                    image = null;

                }, image, serial));
            }

            // configure the options
            options = $.extend({
                delay : 200,
                callback: null,
                prefix: "data-",
                fallback: "desktop",
                fallbackSrc: null
            }, options || { });

            // remove any previous handler
            $("body").unbind("breakpoint.serial" + serial);

            // create the new handler
            $("body").bind("breakpoint.serial" + serial, (function(image, options) {

                var
                    // have we set the src at least once?
                    once = false,

                    // track our delay timeout
                    timeout = null,

                    // track our current breakpoint setting
                    currentBreakpoint = null,

                    // set the image's src
                    set = function(breakpoint) {

                        var src;

                        // now we've processed this image at least once
                        once = true;

                        // logically, any timeout must be finished
                        timeout = null;

                        // resolve the breakpoint
                        breakpoint = breakpoint || options.fallback;

                        // update?
                        if (breakpoint !== currentBreakpoint) {

                            src = image.attr(options.prefix + breakpoint) || options.fallbackSrc;
                            if (src) {
                                image.attr("src", src);
                            }

                            if (typeof options.callback === "function") {
                                options.callback.call(image, breakpoint, src);
                            }
                            currentBreakpoint = breakpoint;
                        }
                    };

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

                    // run immediately or time out?
                    if (!once || options.delay <= 0) {
                        set(evt.breakpoint);
                    } else {
                        timeout = setTimeout(partial(set, evt.breakpoint), options.delay);
                    }
                };

            })(image, options));
        });

        // now that we have some images, update the breakpoint
        // to give them a chance to set their images
        updateBreakpoint();

        return this;
    };

})(jQuery, window, document);
