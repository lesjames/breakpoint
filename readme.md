# Breakpoint

Breakpoint aims to take some of the pain out of creating a
responsive layout. Breakpoint figures out the minimum screen size
needed to achieve the layout you want and creates the media
query for you.

## The Grid

The grid is based on a mobile first fluid layout that can be triggered 
at a break point to go fixed. Styles cascade from smaller break 
points up into larger ones. The breakpoint mixin provides a simple method of
setting element sizes when certain break points become available. 
Media queries for any number of columns are automatically generated
when the screen becomes wide enough for the necessary number of 
columns to display. Everything is calculated from the column and 
gutter size width variables.

Simply stated you just need to know how many columns you need for a 
layout and breakpoint will generate the media query needed to trigger that layout.

### Grid Setup

You can setup your project by defining a couple variables needed to configure
your grid.

```
$column:	 60px;	// column-width of your grid in pixels
$gutter:	 20px;	// gutter-width of your grid in pixels
$columns:	 16;	// maximum number of columns needed for layout
$fixed-grid: 8;		// number of columns to trigger fixed grid
$ie-support: false; // number of columns for vintage ie
```

Setting `$column` `$gutter` and `$columns` define your grid. Breakpoint uses
these values to generate the size of elements and the media queries necessary
to trigger those element sizes.

`$fixed-grid` sets the number of columns necessary to transform the grid from a fluid to
a fixed layout.

`$ie-support` set the number of columns that vintage IE should use as a layout. Since
breakpoint generates most of your structure inside media queries vintage IE won't see
it and thus serve the single column fluid layout. `$ie-support` will make sure that a
single, fixed grid layout gets served to vintage IE without media queries.

## The Breakpoint Mixin

`breakpoint()` is the mixin you use to create layouts for a specific breakpoint. You pass
the number of columns you want on screen as an argument and breakpoint creates the media query
for you.

```
@include breakpoint(8) {
  .container  { width: col(8); }
  .main       { width: col(5); }
  .sidebar    { width: col(3); }
}

@include breakpoint(12) {
  .container  { width: col(12); }
  .main       { width: col(8); }
  .sidebar    { width: col(4); }
}
```

The code above generates the following markup...

```
@media (min-width: 41.25em) {
  .container { width: 38.75em; }
  .main      { width: 23.75em; }
  .sidebar   { width: 13.75em; }
}

@media (min-width: 61.25em) {
  .container { width: 58.75em; }
  .main      { width: 38.75em; }
  .sidebar   { width: 18.75em; }
}
```

### Sandboxing

Breakpoint uses a mobile first approach to cascading styles up to larger layouts. Sometimes
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

## Credits

Breakpoint uses the following frameworks and technologies:

[H5BP](http://html5boilerplate.com/), 
[normalize.css](http://necolas.github.com/normalize.css/), 
[Frameless Grid](http://framelessgrid.com/), 
[Sass](http://sass-lang.com/), 
[Compass](http://compass-style.org/)