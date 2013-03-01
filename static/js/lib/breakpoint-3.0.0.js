(function($, window, document){

    var
        // regex to strip quotes around the breakpoint label
        rxQuotes = /('|"|\s+)/g,

        // defer setting any images until the breakpoint label
        // has been calculated the first time
        breakpointReady = $.Deferred(),
        ready = breakpointReady.promise(),

        // the current serial number
        serial = 0,

        // the current breakpoint label
        breakpoint = null,

        // get breakpoint label list
        labels = (function () {
            var labels = window.getComputedStyle && window.getComputedStyle(document.body, '::after');
            if (labels) {
                labels = labels.content || null;
                if (typeof labels === 'string' || labels instanceof String) {
                    labels = labels.replace(rxQuotes, '');
                    // convert label list into an array
                    labels = labels.split(',');
                }
            }
            return labels;
        }()),

        // searches label array for current breakpoint and returns position
        searchLabels = function (stringArray, breakpoint) {
            for (var j=0; j<stringArray.length; j++) {
                if (stringArray[j].match(breakpoint)) { return j; }
            }
            return -1;
        },

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
                };
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
                style = window.getComputedStyle && window.getComputedStyle(document.body, '::before');

            if (style) {
                breakpoint = style.content || null;
                if (typeof breakpoint === 'string' || breakpoint instanceof String) {
                    breakpoint = breakpoint.replace(rxQuotes, '');
                }
            }

            // fulfill the promise or dispatch an event?
            if (breakpointReady !== null) {

                breakpointReady.resolve();
                breakpointReady = null;

            } else if (breakpoint !== currentBreakpoint) {

                $('body').trigger($.Event('breakpoint', { breakpoint: breakpoint }));
            }
        };

    // update the breakpoint on load
    $(document).ready(updateBreakpoint);

    // update the breakpoint on window resize
    $(window).bind('resize.breakpoint', updateBreakpoint);

    // define the plugin
    $.fn.breakpoint = function(options) {

        this.each(function() {

            var image = $(this),
                serial = image.data('breakpoint-serial');

            // has this not yet been registered?
            if (!serial) {
                serial = nextSerial();
                image.data('breakpoint-serial', serial);

                // be a good memory citizen
                $(document).bind('unload.breakpoint.serial' + serial, partial(function(image, serial) {

                    // unbind our closures so garbage collection can happen
                    image.unbind('breakpoint.serial' + serial);
                    $(this).unbind('unload.breakpoint.serial' + serial);
                    image = null;

                }, image, serial));
            }

            // configure the options
            options = $.extend({
                delay : 200,
                callback: null,
                prefix: '',
                fallback: null
            }, options || { });

            // remove any previous handler
            $('body').unbind('breakpoint.serial' + serial);

            // create the new handler
            $('body').bind('breakpoint.serial' + serial, (function(image, options) {

                var
                    // have we set the src at least once?
                    once = false,

                    // track our delay timeout
                    timeout = null,

                    // track our current breakpoint setting
                    currentBreakpoint = null,

                    // set the image's src
                    set = function(breakpoint) {

                        var src, position;

                        // now we've processed this image at least once
                        once = true;

                        // logically, any timeout must be finished
                        timeout = null;

                        // resolve the breakpoint
                        breakpoint = breakpoint || options.fallback;

                        // update?
                        if (breakpoint !== currentBreakpoint) {

                            // breakpoint position in the array of known breakpoints
                            position = (labels) ? searchLabels(labels, breakpoint) : null;

                            src = (function () {

                                // find source by first trying the current breakpoint
                                var src = image.attr('data-' + options.prefix + breakpoint),
                                    i = position - 1;

                                // if no match is found walk backwards through the
                                // labels array until a matching data attr is found
                                if (src === undefined) {
                                    for (i; i >= 0; i = i - 1) {
                                        src = image.attr('data-' + options.prefix + labels[i]);
                                        if (src !== undefined) {
                                            break;
                                        }
                                    }
                                }

                                return src;
                            }());

                            if (src) {
                                image.attr('src', src);
                            } else {
                                console.warn('Breakpoint could not find a source for: ' + image[0].outerHTML);
                            }

                            if (typeof options.callback === 'function') {
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
