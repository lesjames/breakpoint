/*!
 * jQuery Breakpoint plugin v4.6.4
 * http://github.com/lesjames/breakpoint
 *
 * MIT License
 */

(function (factory) {

    if (typeof define === 'function' && define.amd) {

        // AMD. Register as an anonymous module.
        define(['jquery', 'imagesloaded', 'eventEmitter/EventEmitter'], factory);

    } else {

        // Browser globals
        factory(window.jQuery, window.imagesLoaded, window.EventEmitter);

    }

}(function ($, imagesLoaded, EventEmitter) {

    // breakpoint functions
    // ==========================================================================

    // some craxy regex to deal with how browsers pass the JSON through CSS
    function removeQuotes(string) {
        if (typeof string === 'string' || string instanceof String) {
            string = string.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, '');
        }
        return string;
    }

    // get the breakpoint labels from the body's css generated content
    function getBreakpoint() {

        var style = null;

        // modern browser can read the label
        if (window.getComputedStyle && window.getComputedStyle(document.body, '::before')) {

            // grab json from css generated content
            style = window.getComputedStyle(document.body, '::before');
            style = style.content;

        } else {

            // older browsers need some help
            var getComputedFallback = function(el) {
                this.el = el;
                this.getPropertyValue = function(prop) {
                    var re = /(\-([a-z]){1})/g;
                    if (re.test(prop)) {
                        prop = prop.replace(re, function () {
                            return arguments[2].toUpperCase();
                        });
                    }
                    return el.currentStyle[prop] ? el.currentStyle[prop] : null;
                };
                return this;
            };

            // fallback label is added as a font-family to the head, thanks Jeremy Keith
            style = getComputedFallback(document.getElementsByTagName('head')[0]);
            style = style.getPropertyValue('font-family');

        }

        // parse that sucka and return it
        return JSON.parse(removeQuotes(style));

    }

    // finds the source of an image by matching breakpoint label to image data attr
    function findSource($image, set) {

        // try the current breakpoint first
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
        var src = findSource($image, set);
        if (src) {
            // cached images don't fire load sometimes, so we reset src
            $image.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
            $image.attr('src', src);

        }
        return $image;
    }

    // callback and deferred execution
    function breakpointComplete(set) {

        // this requires imagesLoaded and that requires querySelector
        if (imagesLoaded && document.querySelectorAll && set.images.length > 0) {

            var load = imagesLoaded(set.images);

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


    // Breakpoint Constructor
    // ==========================================================================

    function BreakpointImages( images ) {

        // keep a reference to this
        var _this = this;

        // store the selected images
        this.images = images;

        // create callback and deferred
        this.callback = null;
        this.dfd = $.Deferred();

        // breakpoint default options
        this.options = {
            prefix: '',
            debug: false
        };

        // check to see if the breakpoint has changed
        this.checkBreakpoint = function () {

            // grab the latest breakpoint so we can see it if updated
            var latestBreakpoint = getBreakpoint();

            // if the breakpoint is set and it matches the previous value bail out
            if (_this.breakpoint && _this.breakpoint.current === latestBreakpoint.current) {
                return;
            }

            // breakpoint is new so save it
            _this.breakpoint = latestBreakpoint;
            _this.processImages();
        };

        // process the images with the current breakpoint
        this.processImages = function () {

            if (_this.images.length > 0) {
                _this.images.each(function () {
                    setSource( $(this), _this );
                });
            }
            breakpointComplete(_this);
        };

        // init event listener
        this.on('breakpoint.init', function () {

            _this.checkBreakpoint();

            // return true removes this listener
            return true;

        });

        // window resize listener
        this.on('breakpoint.update', _this.checkBreakpoint);

        // for removing the resize listener
        this.removeEvent = function () {
            _this.off('breakpoint.update', _this.checkBreakpoint);
        };

    }

    // add event methods
    BreakpointImages.prototype = new EventEmitter();


    // define the plugin
    // ==========================================================================

    $.fn.breakpoint = function (options, callback) {

        var $images = [];

        if (this[0] !== document) {
            // reduce selection to only images
            $images = this.find('img').add( this.filter('img') );
        }

        // create an instance and pass it selected images
        var breakpointImages = new BreakpointImages( $images );

        // if callback passed as only argument
        if ( $.isFunction( options ) ) {
            callback = options;
            options = {};
        }

        // store options and callback on instance
        breakpointImages.options = $.extend({}, breakpointImages.options, options);
        breakpointImages.callback = callback;


        // event bindings
        // ==========================================================================

        // get things started
        $(document).ready(function () {
            breakpointImages.trigger('breakpoint.init');
        });

        // reevaluate breakpoint when window resizes
        $(window).on('resize.breakpoint', function () {
            breakpointImages.trigger('breakpoint.update');
        });

        // remove listeners on unload
        $(window).on('unload.breakpoint', function () {
            $(window).off('.breakpoint');
            breakpointImages.removeEvent();
        });

        if (breakpointImages.options.debug) {

            // if debug return functions for testing
            return {
                breakpointImages: breakpointImages,
                removeQuotes: removeQuotes,
                getBreakpoint: getBreakpoint,
                findSource: findSource,
                setSource: setSource
            };

        } else {

            // return the deferred and attach it to the instance
            return breakpointImages.dfd.promise( breakpointImages );

        }

    };

}));