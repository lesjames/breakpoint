# Breakpoint

Breakpoint aims to take some of the pain out of creating a
responsive layout. Breakpoint figures out the minimum screen size
needed to achieve the layout you want and creates the media
query for you.

****

Breakpoint is a mobile first fluid layout that can be triggered 
at a break point to go fixed. Styles cascade from smaller break 
points up into larger ones. Mixins provide simple methods to set 
the size of containers when certain break points become available. 
Media queries for any number of columns are automatically generated
when the screen becomes wide enough for their display.
Everything is calculated from the column and gutter size width variables.

Simply stated you just need to know how many columns you need for a 
layout and Breakpoint will generate the media query needed to trigger that layout.

The important mixins to remember are `set-fixed-bp()` and `set-bp()`.

## set-fixed-bp($bp)

This mixin takes a mandatory argument which is the number of 
columns needed to trigger a fixed width layout. This mixin converts 
the .container class into a fixed width centered div and the .col 
class into a floated column with left margin matching the gutter size.
This mixin must be fired without a selector on the root.
	
	// set the fixed grid to trigger when 6 columns are available
	@include set-fixed-bp(6);

## set-bp($bp, $width, $content)

This mixin takes a mandatory argument which is the number of columns 
needed to trigger a set of styles. A second argument can be passed to 
set the element's width in columns. If passing styles to the media query
then the third argument must be set to true. If you are just passing styles
without setting a width then you must us the named argument `$content = true;`
	
	// when 6 columns are available set .main to be 4 columns wide
	.main { @include set-bp(6, 4); }
	
The mixin can be used to set multiple break point sizes for an element...
	
	// set widths for multiple break points
	.main {
		@include set-bp(7, 5);
		@include set-bp(10, 7);
		@include set-bp(14, 10);
	}

Additional styles can be passed a content block...
	
	// set width for multiple break points
	// and pass styles for those layouts
	.main {
		@include set-bp(7, 5, true) { /* styles */ }
		@include set-bp(10, 7, true) { /* styles */ }
	}

Passing styles without setting a width requires you using the named argument...
	
	.main {
		@include set-bp(7, $content: true) { /* styles */ }
	}

## set-sandbox-bp($min, $max)

Although the mobile first approach of cascading styles up to larger layouts should be
your mindset, sometimes you need to sandbox styles between two breakpoints. Using this
mixin will pass styles to a min/max media query and prevent those styles from cascading up
to larger layouts.

	.main {
		@include set-sandbox-bp(6, 10) {
			/* styles for a breakpoint between 6 and 10 columns */
		}
	}

## IE Support

Older versions of IE don't support media queries but fallback support is built into Breakpoint.
Set the `$ie-support` variable to the number of columns you want IE to recognize as a layout. This
overrides the fluid mobile first layout and only serves vintage IE a single fixed layout.

****

#### Credits

Breakpoint uses the following frameworks and technologies:

[H5BP](http://html5boilerplate.com/), 
[normalize.css](http://necolas.github.com/normalize.css/), 
[Frameless Grid](http://framelessgrid.com/), 
[Sass](http://sass-lang.com/), 
[Compass](http://compass-style.org/)