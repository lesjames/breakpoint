# Breakpoint - 3.0.0

Breakpoint is a grid system and responsive image solution. It's based on the concept that columns shouldn't
stretch but get added or taken away as the screen changes size. This concept
was taken from the [Frameless Grid](http://framelessgrid.com/) system developed by Joni Korpi.
The Breakpoint grid is also floatless by using inline-block cells and border box sizing. This
layout technique is taken from [Griddle](https://github.com/necolas/griddle) by Nicolas Gallagher.
Breakpoint generates media queries at column break points so that your layout always has enough
room to fit on the screen. Your media queries can be labeled which allows JavaScript to pair them
with responsive image sources.

## Installation

Breakpoint requires a minimum of Sass 3.2 and Compass

`$ gem install sass`

`$ gem install compass`

You can then start a new Breakpoint project by cloning the repo

`$ git clone https://github.com/lesjames/Breakpoint.git MYPROJECTNAME`

### Resources

Here is a writeup about [Breakpoint on 24 Ways](http://24ways.org/2012/redesigning-the-media-query/).  
You can [view a presentation about Breakpoint](http://wordpress.tv/2012/12/18/les-james-responsive-design-with-the-breakpoint-framework/) on wordpress.tv.  
Here is a [Codepen demo](http://codepen.io/lesjames/pen/ixjsc) that you can play with.  
You can hit up [Les James on Twitter](https://twitter.com/lesjames) with any questions.

## Grid

The Breakpoint grid starts as a fluid grid for mobile. It gets transformed into a
fixed width layout at your first breakpoint. When the grid is fixed width, grid column and gutter widths
become constant and are set by the following variables in the `static/sass/_config.scss` file.

```sass
$grid-column: 60px;
$grid-gutter: 20px;
```

### Grid Markup

Breakpoint uses three classes to establish a grid. First `.wrapper` is used as
a fixed width centering div. `.grid` is the parent container for your cells and is always
100% fluid in width. `.grid-cell` is the child unit and can be set to either fixed or
fluid widths. You should avoid applying styles to these classes because it can misalign
the grid or create unexpected results.

### Helper Functions

Sizing `.grid-cell` elements in your layout requires a class name to hook on to.
There are a couple functions for sizing elements but by default you should use the fluid() 
function for sizing `.grid-cell` elements.

`fluid($col, [$available-columns])` calculates a percentage based on how many columns you want. Has an optional
second argument that can override the number of availiable columns when calulating the
percentage.

`fixed($col, [false])` calculates a fixed width for grid cells. Passing false as a second argument
calculates a fixed width for items outside of the grid system. It overrides the built in gutter and should
be applied to elements other than `.grid-cell` units or when calculating measurements like heights. 

### The Breakpoint Mixin

`breakpoint()` is the mixin you use to create layouts for a specific breakpoint. You pass
the number of columns you want on screen as an argument and breakpoint creates the media query needed
to trigger this layout when the screen becomes wide enough. Note that a matching centering `.wrapper` class is
auto generated for each break point.

```sass
// 8 column breakpoint
@include breakpoint(8) {
    .main { width: fluid(5); }
	.sidebar { width: fluid(3); }
}

// 12 column breakpoint
@include breakpoint(12) {
	.main { width: fluid(8); }
	.sidebar { width: fluid(4); }
}
```

The code above generates the following markup (formatted for readability)

```css
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

### Other Media Queries

You can view a full range of [breakpoint mixin examples](https://github.com/lesjames/Breakpoint/wiki/Breakpoint-Mixin-Test-Cases) on the wiki.
In addition to min and max width combinations you can create orientation and pixel ratio media queries.

## Responsive Images

Breakpoint comes with a jQuery plugin that allows you to load images for the currently
active breakpoint. You just need to label your breakpoints in Sass and JavaScript
matches that name to a matching data attribute on the image tag.

### HTML

Store source paths in data attributes on an image tag. Make sure you provide
a `<noscript>` fallback.

```html
<img class="responsive-image" data-small="/static/img/small.gif" data-large="/static/img/large.gif" />
<noscript><img src="/static/img/small.gif" /></noscript>
```

### Sass

When you create a breakpoint, pass it a argument called `$label` with a string as the name you want. 

```sass
@include breakpoint(6, $label: 'medium');
@include breakpoint(9, $label: 'large');
```

There is a config variable called `$breakpoint-list` and it defaults the name of the smallest,
fluid layout to 'small'. You can change this to 'mobile' or any name that makes sense to you.

### jQuery

Apply the Breakpoint plugin on any image you want to make responsive.

`$('.responsive-image').breakpoint();`

There are some options you can pass as an object to the breakpoint plugin.

**callback** - This is a function that will be called once the source of the image is set. The callback
receives a jQuery object of the image as `this`. The callback gets passed two parameters,
the current breakpoint label and the source that was applied.

```javascript
$('.responsive-image').breakpoint({
    callback : function (breakpoint, src) {
        console.log(this, breakpoint, src);
    }
});
```

**delay** - This is the time it takes to reevaluate responsive images when resizing the screen. It
defaults to 200 milliseconds.

**prefix** - Breakpoint assumes that the data attribute is simply the label. So if the label is 'small' then
breakpoint looks for `data-small` on the image tag. If you want to prefix the label with something
then use this option.  
So `prefix : 'foo'` will look for an attribute called `data-foo-small`.

**fallback** - This is a label that you can use for browsers that don't support `getComputedStyle`.

## Other Features

### IE Support

`$ie-support` sets the number of columns that vintage IE should use as a layout. Since
breakpoint generates your fixed width structure inside media queries vintage IE won't see
it and thus serve the mobile first fluid layout. `$ie-support` will make sure that a
single, fixed width layout gets served to vintage IE without media queries. You need to
make sure that the column count you set for `$ie-support` matches a layout breakpoint.

### Grid Overlay

Setting `$grid-overlay` to true will generate a visual overlay of your grid for testing.
You just need to create an element in your HTML to see it. `<div class="grid-overlay"></div>`

## Credits

Breakpoint uses the following frameworks, technologies and inspirations:

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
