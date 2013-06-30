# 4.6.1

Removed accidental hard coded IE column count

# 4.6.0

* Fix for IE image loading
* Removed need to set fallback labels in Javascript. Yay!!

# 4.5.0

* Rewrite for more testable code
* EventEmitter is now a required dependency
* Removed delay option
* Can be applied without a selector with `$.fn.breakpoint();`

# 4.4.0

* Made imagesloaded a seperate dependency
* Changed the return values that get sent back to callbacks/deferreds

# 4.3.2

* Added some basic tests for responsive images

# 4.3.1

* Added fallback data to callback when using breakpoint on document

# 4.3.0

* Better fallback support for older browsers
* Better tolerance for missing sources
* Now has imagesLoaded built in
* Now returns a deferred
* Revised data object passed to callbacks

# 4.2.0

* Added AMD support
* Removed stuff I don't understand

# 4.1.0

* Changed how callbacks are passed
* Added special callback when applying breakpoint to the document

# 4.0.0

* Removed everything except Breakpoint mixins, grid classes and jquery plugin.
* Moved scaffolding to a seperate project: [Breakpoint Scaffold](https://github.com/lesjames/breakpoint-scaffold)
* Make Breakpoint a Bower package