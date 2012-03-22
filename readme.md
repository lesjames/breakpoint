# Breakpoint

A starter template based on [HTML5 Boilerplate](http://html5boilerplate.com/), [Twitter Bootstrap](http://twitter.github.com/bootstrap/), [Frameless Grid](http://framelessgrid.com/) and written with the aid of [Sass](http://sass-lang.com/) and [Compass](http://compass-style.org/)

### Grid

Grid is based on a mobile first fluid layout that can be triggered at a break point to go fixed. Styles cascade from smaller break points up into larger ones. Mixins provide simple methods to set the size of containers when certain break points become available. Media queries for any number of columns are automatically generated for when the screen becomes wide enough for the necessary number of columns to display. Everything is calculated from the columns and gutter size widths.

Simply stated you just need to know how many columns you need for a layout and the mixins will generate the media query needed to trigger that layout.

The important mixins to remember are go-fixed() and set-bp().

#### go-fixed($bp)

This mixin takes one mandatory argument which is the number of columns needed to trigger a fixed width layout. This mixin converts the .container class into a fixed width centered div and the .col class into a floated column with margin-left.

This mixin must be fired without a selector on the root.
    
    // set the fixed grid to trigger when 6 columns are available
    @include go-fixed(6);

#### set-bp($bp, $width: false)

This mixin takes a mandatory argument which is the number of columns needed to trigger a set of styles. A second argument can be passed to quickly set the element's width in columns.
    
    // when 6 columns are available set .main to be 4 columns wide
    .main { @include set-bp(6, 4); }
    
The mixin can be used to set multiple break point sizes for an element with
    
    // set widths for multiple break points
    .main { @include set-bp(7, 5); @include set-bp(10, 7); @include set-bp(14, 10); }

Additional styles can be passed a content block.
    
    // set widths for multiple break points and change any number of internal styles
    .main {
        @include set-bp(7, 5) { background: white; }
        @include set-bp(10, 7) { background: gray; color: white; }
    }