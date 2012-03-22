# Breakpoint

A starter template based on (HTML5 Boilerplate)[http://html5boilerplate.com/], (Twitter Bootstrap)[http://twitter.github.com/bootstrap/], (Frameless Grid)[http://framelessgrid.com/] and written with the aid of (Sass)[http://sass-lang.com/] and (Compass)[http://compass-style.org/]

### Grid

Grid is based on a mobile first fluid layout that can be triggered at a break point to go fixed. Styles cascade from smaller break points up into larger ones.

The important mixins to remember are go-fixed() and set-bp().

#### go-fixed($bp)

This mixin takes one mandatory argument which is the number of columns needed to trigger a fixed width layout. This mixin converts the .container class into a fixed width centered div and the .col class into a floated column with margin-left.

This mixin must be fired without a selector on the root.

    @include go-fixed(6); // sets the fixed grid to trigger when 6 columns are available

#### set-bp($bp, $width: false)

This mixin takes a mandatory argument which is the number of columns needed to trigger a set of styles. A second argument can be passed to quickly set the element's width in columns.

    .main { @include set-bp(6, 4); }
    
The mixin can be used to set multiple break point sizes for an element with

    .main { @include set-bp(7, 5); @include set-bp(10, 7); @include set-bp(14, 10); }

Additional styles can be passed a content block.

    .main {
        @include set-bp(7, 5) { background: white; }
        @include set-bp(10, 7) { background: gray; }
    }