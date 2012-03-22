# Breakpoint

Breakpoint aims to take some of the pain out of creating a
responsive layout. Breakpoint figures out the minimum screen size
needed to achieve the layout you want and creates the media
query for you.

## Grid

The grid is based on a mobile first fluid layout that can be triggered 
at a break point to go fixed. Styles cascade from smaller break 
points up into larger ones. Mixins provide simple methods to set 
the size of containers when certain break points become available. 
Media queries for any number of columns are automatically generated
when the screen becomes wide enough for the necessary number of 
columns to display. Everything is calculated from the column and 
gutter size width variables.

Simply stated you just need to know how many columns you need for a 
layout and the mixins will generate the media query needed to trigger that layout.

The important mixins to remember are set-fixed-bp() and set-bp().

### set-fixed-bp($bp)

This mixin takes a mandatory argument which is the number of 
columns needed to trigger a fixed width layout. This mixin converts 
the .container class into a fixed width centered div and the .col 
class into a floated column with margin-left. This mixin must be
fired without a selector on the root.
	
	// set the fixed grid to trigger when 6 columns are available
	@include set-fixed-bp(6);

### set-bp($bp, $width: false, $content: false)

This mixin takes a mandatory argument which is the number of columns 
needed to trigger a set of styles. A second argument can be passed to 
quickly set the element's width in columns. If passing a content block
then the third argument must be set to true.
	
	// when 6 columns are available set .main to be 4 columns wide
	.main { @include set-bp(6, 4); }
	
The mixin can be used to set multiple break point sizes for an element with
	
	// set widths for multiple break points
	.main { @include set-bp(7, 5); @include set-bp(10, 7); @include set-bp(14, 10); }

Additional styles can be passed a content block.
	
	// set widths for multiple break points and change any number of internal styles
	.main {
		@include set-bp(7, 5, true) { background: white; }
		@include set-bp(10, 7, true) { background: gray; color: white; }
	}

### set-no-bp($width: false)

This mixin overrides the default mobile fluid layout with a fixed layout that isn't tied
to a break point. Takes an optional width argument that will be applied to the .container
class. Use this mixin without a selector for designs that don't need to be responsive. Use
with an .ie selector to create a fixed width fallback for IE browsers that don't support
media queries.

	// non-responsive layout with a 12 column grid
	@include set-no-bp(12);
	
	// set an IE fallback in an otherwise responsive design
	.ie8 { @include set-no-bp(12); }
	
## Credits

Breakpoint uses the following frameworks and technologies:

* [H5BP](http://html5boilerplate.com/)
* [normalize.css](http://necolas.github.com/normalize.css/)
* [Frameless Grid](http://framelessgrid.com/)
* [Sass](http://sass-lang.com/)
* [Compass](http://compass-style.org/)