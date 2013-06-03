// remove quotes function
test('Remove Quotes', 4, function () {

    var test = $.fn.breakpoint({ debug: true });

    deepEqual( test.removeQuotes('yep'), 'yep' );
    deepEqual( test.removeQuotes("yep"), 'yep' );
    deepEqual( test.removeQuotes("'yep'"), 'yep' );
    deepEqual( test.removeQuotes('"yep"'), 'yep' );

});


test('Breakpoint Object', 3, function () {

    var test = $.fn.breakpoint({ debug: true });
    var breakpoint = test.updateBreakpoint();

    deepEqual( breakpoint.current, 'small' );
    deepEqual( breakpoint.all, ['small', 'medium', 'large'] );
    deepEqual( breakpoint.position, 0 );

});


test('Find Source', 2, function () {

    var test = $.fn.breakpoint({ debug: true });

    deepEqual( test.findSource($('<img data-small="small.jpg">'), test.breakpointSet), 'small.jpg' );
    deepEqual( test.findSource($('<img>'), test.breakpointSet), undefined );

});


test('Find Source Walks Down', 1, function () {

    var test = $.fn.breakpoint({ debug: true });
    test.breakpointSet.breakpoint = { current: 'medium', all: ['small', 'medium'], position: 1 };

    deepEqual( test.findSource($('<img data-small="small.jpg">'), test.breakpointSet), 'small.jpg' );

});


test('Find Source With Prefix', 2, function () {

    var test = $.fn.breakpoint({ debug: true, prefix: 'awesome-' });

    deepEqual( test.findSource($('<img data-awesome-small="small.jpg">'), test.breakpointSet), 'small.jpg' );
    deepEqual( test.findSource($('<img data-small="small.jpg">'), test.breakpointSet), undefined );

});


test('Set Source', 2, function () {

    var test = $.fn.breakpoint({ debug: true });

    var $inputImage = $('<img data-small="small.jpg">');
    var $inputImage2 = $('<img data-medium="small.jpg">');

    var $outputImage = test.setSource( $inputImage, test.breakpointSet );
    var $outputImage2 = test.setSource( $inputImage2, test.breakpointSet );

    deepEqual( $outputImage.attr('src'), 'small.jpg' );
    deepEqual( $outputImage2.attr('src'), undefined );

});


test('Breakpoint Deferred', 1, function () {

    QUnit.stop();

    var dfd = $.fn.breakpoint();

    dfd.always(function (breakpoint) {
        QUnit.start();
        deepEqual( breakpoint.current, 'small' );
    });

});

test('Breakpoint Callback', 1, function () {

    QUnit.stop();

    $.fn.breakpoint(function (breakpoint) {
        QUnit.start();
        deepEqual( breakpoint.current, 'small' );
    });

});

test('imagesLoaded', 1, function () {

    QUnit.stop();

    var $image = $('<img data-small="http://i.imgur.com/b3fBJ.jpg">');
    var dfd = $image.breakpoint();

    dfd.done(function (breakpoint, instance) {
        QUnit.start();
        deepEqual( instance.elements[0], $image[0] );
    });

});


