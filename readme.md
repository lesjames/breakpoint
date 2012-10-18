# Breakpoint

Breakpoint is a grid system based on the concept that columns shouldn't
stretch but get added or taken away as the screen changes size. This concept
was taken from the [Frameless Grid](http://framelessgrid.com/) system developed by Joni Korpi.
The Breakpoint grid is also floatless by using inline-block cells and border box sizing. This
layout technique is taken from [Griddle](https://github.com/necolas/griddle) by Nicolas Gallagher.
Breakpoint generates media queries at column break points so that your layout always has enough
room to fit on the screen. It has helper functions to calculate both fluid and fixed widths for
your columns.

## Installation

Breakpoint requires Sass 3.2 and Compass

`$ gem install sass`

`$ gem install compass`

You can then start a new Breakpoint project by cloning the repo

`$ git clone https://github.com/lesjames/Breakpoint.git MYPROJECTNAME`

## The Grid

Breakpoint is a mobile first fluid layout that gets triggered 
at a break point to go fixed width. Styles cascade from smaller break 
points up into larger ones. The `breakpoint()` mixin provides a simple method of
setting media query sizes when certain column break points become available. 
Everything is calculated from the column and gutter size width variables.

Simply stated you just need to know how many columns you need for a 
layout and breakpoint will generate the media query needed to trigger that layout.

### Grid Setup

The grid column and gutter sizes don't change when the layout gets triggered into
a fixed width. These sizes are set by the following variables...

```
$grid-column: 60px;
$grid-gutter: 20px;
```

### Grid Markup

Breakpoint uses three classes to establish a grid. First `.wrapper` is used as
a fixed width centering div. `.grid` is the parent container for your cells and is always
100% fluid in width. `.grid-cell` is the child unit and can be set to either fixed or
fluid widths.

### Helper Functions

Sizing `.grid-cell` elements in your layout requires a class name to hook onto and a helper
function for translating a column count into a width.

`.sidebar { width: fluid(3); }`

There are a couple functions for sizing elements but by default you should use the fluid() 
function for sizing `.grid-cell` elements.

`fluid($col)` calculates a percentage based on how many columns you want. Has an optional
second argument that can override the number of availiable columns when calulating the
percentage.

`fixed($col)` calculates a fixed width for grid cells.

`no-grid-fixed($col)` calculates a fixed width for items outside of the grid system. This function
does not assume border-box sizing and should be applied to elements other than `.grid-cell` units. 

## The Breakpoint Mixin

`breakpoint()` is the mixin you use to create layouts for a specific breakpoint. You pass
the number of columns you want on screen as an argument and breakpoint creates the media query needed
to trigger this layout when the screen becomes wide enough. Note that a matching centering `.wrapper` class is
auto generated for each break point.

```
// 8 column breakpoint
@include breakpoint(8) {
    .main {  width: fluid(5); }
	.sidebar { width: fluid(3); }
}

// 12 column breakpoint
@include breakpoint(12) {
	.main {  width: fluid(8); }
	.sidebar { width: fluid(4); }
}
```

The code above generates the following markup (formatted for readability)

```
@media (min-width: 41.25em) {
    .wrapper { width: 38.75em; margin-left: auto; margin-right: auto; }
    .main { width: 62.5%; }
    .sidebar { width: 37.5%; }
}
@media (min-width: 61.25em) {
    .wrapper { width: 58.75em; margin-left: auto; margin-right: auto; }
    .main { width: 66.66667%; }
    .sidebar { width: 33.33333%; }
}
```

### Sandboxing

Breakpoint uses a mobile first approach of cascading styles up to larger layouts. Sometimes
it might be necessary to sandbox some styles between two breakpoints to prevent them
from cascading up to larger layouts. The `breakpoint()` mixin will accept a second
argument for cases like this and generate a min/max width media query for those styles.

```
@include breakpoint(9, 11) {
  .main { /* sandboxed styles */ }
}
```

will generate...

```
@media (min-width: 46.25em) and (max-width: 56.25em) {
  .main { /* sandboxed styles */ }
}
```
### Other Media Queries

You can view a full range of [breakpoint mixin examples](https://github.com/lesjames/Breakpoint/wiki/Breakpoint-Mixin-Test-Cases) on the wiki.
In addition to min and max width combinations you can create orientation and pixel ratio media queries. There are also arguments
for creating breakpoint labels and disabling the wrapper class sizing.

## Other Features

### IE Support

`$ie-support` sets the number of columns that vintage IE should use as a layout. Since
breakpoint generates your fixed width structure inside media queries vintage IE won't see
it and thus serve the mobile first fluid layout. `$ie-support` will make sure that a
single, fixed width layout gets served to vintage IE without media queries. You need to
make sure that the column count you set for `$ie-support` matches a layout break point.

### Grid Overlay

Setting `$grid-overlay` to true will generate a visual overlay of your grid for testing.

## Responsive Images

Breakpoint creates a hook in your CSS that can be read by Javascript. JS uses this hook
to determine what layout is active. Using this information JS can conditionally load
images by defining data attributes on your image tags. Your HTML should look like this...

```
<img class="responsive-image" data-mobile="/elements/img/mobile.gif" data-desktop="/elements/img/desktop.gif" />
<noscript><img src="/elements/img/desktop.gif" /></noscript>
```

In breakpoint you create labels for like so...

`@include breakpoint(9, $label: 'desktop')`

This creates a label of 'desktop' which gets matched to the image source in the 'data-desktop'
attribute. Breakpoint will then load that image into your layout. Labels can be given any name you
want, just make sure that the CSS label has a matching HTML label.

Breakpoint's responsive image script is a jQuery plugin and it is applied to an image like so...

`$('.responsive-image').breakpoint();`

There are a couple of options that you can set too.

* 'delay' - Delay sets the time difference between the window resize and running the respoinsive image scripts. Delay is
useful for preventing the scripts from firing on every pixel change as you resize the window. Default delay is `200`.
* 'callback' - You can define a callback function to fire when the responsive image scripts have finished.
* 'prefix' - If you want a custom HTML attribute label prefix. The default prefix is `data-`
* 'fallback' - This is a label that you can set for browsers that don't support media queries. Default label is 'desktop',
* 'fallbackSrc' - Something crashing and burning? Do you have matching labels in CSS and HTML? If something is failing you
can set a fallback source that will be used if something went horribly wrong.

Here is an example of using options...

```
$('.responsive-image').breakpoint({
  'delay' : 50,
  'callback' : function(){
    // do something awesome
  },
  'prefix' : 'data-src-'
});
```

## Changelog

10/10/12 - Rewrote responsive images script  
9/6/12 - Fixed pixel ratio mq to either be high or low res conditional  
8/17/12 - Added orientation and pixel ratio mqs. Added argument to disable wrapper class.  
8/8/12 - Removed modular scale.  
8/3/12 - Reworked responsive images and dom labels.  
6/28/12 - Simplified helper functions. Added vertical rhythm component.  
6/11/12 - Reorg and cleanup. Added JS hook and script.  
5/28/12 - Pushed version 2.0

## Credits

Breakpoint uses the following frameworks and technologies:

[H5BP](http://html5boilerplate.com/), 
[normalize.css](http://necolas.github.com/normalize.css/), 
[Griddle](https://github.com/necolas/griddle), 
[Frameless Grid](http://framelessgrid.com/), 
[Sass](http://sass-lang.com/), 
[Compass](http://compass-style.org/), 
[Conditional CSS](http://adactio.com/journal/5429/),
[DetectMQ.js](https://github.com/viljamis/detectMQ.js),
[jQuery](http://jquery.com/), 
[Modernizr](http://modernizr.com/)