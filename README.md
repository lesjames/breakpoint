# Breakpoint [![Build Status](https://travis-ci.org/lesjames/breakpoint.png?branch=master)](https://travis-ci.org/lesjames/breakpoint)

Breakpoint is a grid system and responsive image solution. It's based on the concept that columns shouldn't stretch but get added or taken away as the screen changes size. This concept was taken from the [Frameless Grid](http://framelessgrid.com/) system developed by Joni Korpi. The Breakpoint grid is also floatless by using inline-block cells and border box sizing. This layout technique is taken from [Griddle](https://github.com/necolas/griddle) by Nicolas Gallagher. Breakpoint generates media queries at column break points that you determine. You can also label your media queries which allows JavaScript to pair them with responsive image sources.

## Installation

The Breakpoint grid requires Sass 3.2 or later

`$ sudo gem install sass`

If you want to use Breakpoint for responsive images you need [jQuery](http://jquery.com/) and [EventEmitter](https://github.com/Wolfy87/EventEmitter). While not a requirement, you can get enhanced deferreds/callbacks when working with responsive images by installing [imagesLoaded](https://github.com/desandro/imagesloaded).

#### Bower

The quickest way to install Breakpoint is with [Bower](http://bower.io/).

`bower install breakpoint`

Then in your Sass import Breakpoint from your Bower components directory. The following assumes the bower component folder is the same level as your Sass folder.

`@import '../components/breakpoint/breakpoint/breakpoint'`

The jQuery plugin for Breakpoint is AMD compatable and should be loaded with a tool like [RequireJS](http://requirejs.org/). If you don't use AMD then make sure jQuery and EventEmitter are loaded before the Breakpoint plugin.

#### Yeoman

For a full, opinionated project setup that includes a build system using [Grunt](http://gruntjs.com/) and AMD loading with [RequireJS](http://requirejs.org/), you can [install Breakpoint with Yeoman](https://github.com/lesjames/generator-breakpoint).

#### Resources

* Here is a writeup about [Breakpoint on 24 Ways](http://24ways.org/2012/redesigning-the-media-query/).
* You can [view a presentation about Breakpoint](http://wordpress.tv/2012/12/18/les-james-responsive-design-with-the-breakpoint-framework/) on wordpress.tv.
* Here is a [Codepen demo](http://codepen.io/lesjames/pen/ixjsc) that you can play with.
* You can hit up [Les James on Twitter](https://twitter.com/lesjames) with any questions.

## Grid

The Breakpoint grid **starts as a fluid grid** for mobile. It gets transformed into a **fixed width layout at your first breakpoint**. When the grid is fixed width, grid column and gutter widths become constant and are set by the following variables.

```scss
$grid-column: 60px;
$grid-gutter: 20px;
```

### Grid Markup

Breakpoint uses three classes to establish a grid. First `.wrapper` is used as a fixed width centering div. `.grid` is the parent container for your cells and is always 100% fluid in width. `.grid__cell` is the child unit and can be set to either fixed or fluid widths. You should avoid applying styles to these classes because it can misalign the grid or create unexpected results. When creating a named hook for a grid cell it's recommended to use the [BEM syntax](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/).

```html
<div class"grid">
    <div class="grid__cell grid__cell--content"></div>
    <div class="grid__cell grid__cell--sidebar"></div>
</div>
```

The BEM syntax will help you remember that this is a structure element and that you shouldn't apply padding to it.

### Helper Functions

Sizing `.grid__cell` elements in your layout requires a class name to hook on to. There are a couple functions for sizing elements but by default you should use the `fluid()` function for sizing `.grid__cell` elements.

**fluid(columns, [totalColumns])**

Calculates a percentage based on how many columns you want. The totalColumns value defaults to the same number as your breakpoint. If you use this function outside of a breakpoint or you want to override math then you can pass the second argument.

**fixed(columns, [false])**

Calculates a fixed width for grid cells. Passing false as a second argument calculates a fixed width for items outside of the grid system. It overrides the built in gutter and should be applied to elements other than `.grid__cell` units or when calculating measurements like heights.

### The Breakpoint Mixin

`breakpoint()` is the mixin you use to create layouts for a specific breakpoint. You pass the number of columns you want on screen as an argument and breakpoint creates the media query needed to trigger this layout when the screen becomes wide enough. Note that a matching centering `.wrapper` class is auto generated for each break point.

```scss
// 8 column breakpoint
@include breakpoint(8) {
    .grid__cell--content { width: fluid(5); }
    .grid__cell--sidebar { width: fluid(3); }
}

// 12 column breakpoint
@include breakpoint(12) {
    .grid__cell--content { width: fluid(8); }
    .grid__cell--sidebar { width: fluid(4); }
}
```

The code above generates the following markup (formatted for readability)

```css
@media (min-width: 41.25em) {
    .wrapper { width: 38.75em; margin-left: auto; margin-right: auto; }
    .grid__cell--content { width: 62.5%; }
    .grid__cell--sidebar { width: 37.5%; }
}
@media (min-width: 61.25em) {
    .wrapper { width: 58.75em; margin-left: auto; margin-right: auto; }
    .grid__cell--content { width: 66.66667%; }
    .grid__cell--sidebar { width: 33.33333%; }
}
```

### Other Media Queries

You can view a full range of [breakpoint mixin examples](https://github.com/lesjames/Breakpoint/wiki/Breakpoint-Mixin-Test-Cases) on the wiki.
In addition to min and max width combinations you can create orientation and pixel ratio media queries.

## Responsive Images

Breakpoint comes with a jQuery plugin that allows you to load images for the currently active breakpoint. You just need to label your breakpoints in Sass and JavaScript matches that name to a matching data attribute on the image tag.

### HTML

Store source paths in data attributes on an image tag. Make sure you provide a `<noscript>` fallback. It's also recommended that you use a data uri as a placeholder src like `src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"` so that the image tag remains valid.

```html
<img class="responsive-image" data-small="/static/img/small.gif" data-large="/static/img/large.gif" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="My responsive image">
<noscript><img src="/static/img/small.gif" alt="My responsive image fallback"></noscript>
```

### Sass

When you create a breakpoint, pass it a argument called `$label` with a string as the name you want.

```scss
@include breakpoint(6, $label: 'medium');
@include breakpoint(9, $label: 'large');
```

The default layout label is 'small' and is generated for you. If you don't like the default name you can change it
with a Sass variable called `$first-breakpoint`.

### jQuery

Apply the Breakpoint plugin on any image you want to make responsive.

```javascript
$('.responsive-image').breakpoint();
```

A Callback can be added which returns an object detailing information about the current layout.

```javascript
$('.responsive-image').breakpoint(function (breakpoint) {
    console.log(breakpoint);
});
```

Breakpoint also returns a deferred which can be used for more robust callbacks.

```javascript
var images = $('.responsive-image').breakpoint();

images.done(function (breakpoint) {
    console.log(breakpoint);
});
```

#### Breakpoint Object

The breakpoint object sent back to a callback or deferred contains the current responsive layout information.

**breakpoint.current** [string] - The current breakpoint label.

**breakpoint.all** [array] - A list of breakpoint labels. The array can be different depending on the active breakpoint. It starts with your smallest breakpoint label and ends with the current label.

The breakpoint object can be obtained without images by calling it without a selector.

```javascript
$.fn.breakpoint(function (breakpoint) {
    console.log(breakpoint)
});
```

#### Options

**prefix** [string] - Breakpoint assumes that the data attribute is simply the label. So if the label is 'small' then breakpoint looks for `data-small` on the image tag. If you want to prefix the label with something then use this option. So `prefix : 'foo-'` will look for an attribute called `data-foo-small`. (Breakpoint doesn't assume a hyphen).


```javascript
$('.responsive-image').breakpoint({ prefix: 'myprefix' }, callback);
```

#### imagesLoaded

Breakpoint works with [imagesLoaded](https://github.com/desandro/imagesloaded) to fire callbacks/deferreds once images set with Breakpoint are loaded. Just make sure imagesLoaded and it's dependencies are loaded on your page. If using AMD provide a path to them in your AMD loader so that Breakpoint can pick them up as dependencies.

Breakpoint returns the imagesLoaded instance in callbacks/deferreds as the second argument after the Breakpoint object. See the [imagesLoaded](https://github.com/desandro/imagesloaded) documentation for working with the instance.

## Other Features

### IE Support

`$ie-support` Sass variable sets the number of columns that vintage IE should use as a layout. Since breakpoint generates your fixed width structure inside media queries vintage IE won't see it and thus serve the mobile first fluid layout. `$ie-support` will make sure that a single, fixed width layout gets served to vintage IE without media queries. You need to make sure that the column count you set for `$ie-support` matches a layout breakpoint.

### Grid Overlay

Setting `$grid-overlay` to true will generate a visual overlay of your grid for testing. You just need to create an element in your HTML to see it. `<div class="grid-overlay"></div>`

## Credits

Breakpoint uses the following frameworks, technologies and inspirations:

[Griddle](https://github.com/necolas/griddle),
[Frameless Grid](http://framelessgrid.com/),
[Sass](http://sass-lang.com/),
[Conditional CSS](http://adactio.com/journal/5429/),
[imagesLoaded](https://github.com/desandro/imagesloaded),
[DetectMQ.js](https://github.com/viljamis/detectMQ.js),
[jQuery](http://jquery.com/)
