// ==========================================================================
    module( 'Utility Function Testing' );
// ==========================================================================

// remove quotes function
test('Remove Quotes', 4, function () {

    var test = $.fn.breakpoint({ debug: true });

    deepEqual( test.removeQuotes('ye"p'), 'yep' );
    deepEqual( test.removeQuotes("ye'p"), 'yep' );
    deepEqual( test.removeQuotes("'yep'"), 'yep' );
    deepEqual( test.removeQuotes('"yep"'), 'yep' );

});

// finds the source by matching the breakpoint label to a data attr on the image
test('Find Source', 2, function () {

    var test = $.fn.breakpoint({ debug: true });

    deepEqual( test.findSource($('<img data-small="small.jpg">'), test.breakpointImages), 'small.jpg' );
    deepEqual( test.findSource($('<img>'), test.breakpointImages), undefined );

});

// if no matching source is found, breakpoint walks down the label array
test('Find Source Walks Down', 1, function () {

    var test = $.fn.breakpoint({ debug: true });

    // override the breakpoint info
    test.breakpointImages.breakpoint = { current: 'medium', all: ['small', 'medium'], position: 1 };

    deepEqual( test.findSource($('<img data-small="small.jpg">'), test.breakpointImages), 'small.jpg' );

});

// make sure that passing a prefix option returns the correct source
test('Find Source With Prefix', 2, function () {

    var test = $.fn.breakpoint({ debug: true, prefix: 'awesome-' });

    deepEqual( test.findSource($('<img data-awesome-small="small.jpg">'), test.breakpointImages), 'small.jpg' );
    deepEqual( test.findSource($('<img data-small="small.jpg">'), test.breakpointImages), undefined );

});

// make sure the image source gets applied
test('Set Source', 2, function () {

    var test = $.fn.breakpoint({ debug: true });

    var $inputImage = $('<img data-small="small.jpg">');
    var $inputImage2 = $('<img data-medium="medium.jpg">');

    var $outputImage = test.setSource( $inputImage, test.breakpointImages );
    var $outputImage2 = test.setSource( $inputImage2, test.breakpointImages );

    deepEqual( $outputImage.attr('src'), 'small.jpg' );
    deepEqual( $outputImage2.attr('src'), undefined );

});


// ==========================================================================
    module( 'Returns' );
// ==========================================================================

// --------------------------------------------------------------------------
// API / getBreakpoint()
// --------------------------------------------------------------------------
// Breakpoint returns an instance of Breakpoint that includes 'breakpoint' info
// 'breakpoint' has keys for 'current', 'all' and 'position'
// --------------------------------------------------------------------------

test('Breakpoint Object on Instance', 3, function () {

    var test = $.fn.breakpoint();

    deepEqual( test.breakpoint.current, 'small' );
    deepEqual( test.breakpoint.all, ['small', 'medium', 'large'] );
    deepEqual( test.breakpoint.position, 0 );

});

// --------------------------------------------------------------------------
// API / always deferred
// --------------------------------------------------------------------------
// Breakpoint returns a deferred that gets passed the 'breakpoint' info
// 'breakpoint' has keys for 'current', 'all' and 'position'
// --------------------------------------------------------------------------

asyncTest('Breakpoint Always Deferred', 4, function () {

    var test = $.fn.breakpoint();

    deepEqual( test.state(), 'resolved' );

    test.always(function (breakpoint) {
        QUnit.start();
        deepEqual( breakpoint.current, 'small' );
        deepEqual( breakpoint.all, ['small', 'medium', 'large'] );
        deepEqual( breakpoint.position, 0 );
    });

});

// always with a failed and resolved image
asyncTest('Breakpoint Always When Good/Bad', 2, function () {

    var $image = $('<img data-small="http://i.imgur.com/xrQHn.jpg"><img data-small="http://i.imdfd.com/dfdf.jpg">');
    var test = $image.breakpoint();

    deepEqual( test.state(), 'pending' );

    test.always(function (breakpoint) {
        QUnit.start();
        ok(true);
    });

});

// --------------------------------------------------------------------------
// API / done deferred
// --------------------------------------------------------------------------
// Breakpoint returns a deferred that gets passed the 'breakpoint' info
// 'breakpoint' has keys for 'current', 'all' and 'position'
// also returns an imagesLoaded instance
// --------------------------------------------------------------------------

asyncTest('Breakpoint Done Deferred', 6, function () {

    var $image = $('<img data-small="http://i.imgur.com/xrQHn.jpg">');
    var test = $image.breakpoint();

    deepEqual( test.state(), 'pending' );

    test.done(function (breakpoint, instance) {

        QUnit.start();
        deepEqual( test.state(), 'resolved' );
        deepEqual( breakpoint.current, 'small' );
        deepEqual( breakpoint.all, ['small', 'medium', 'large'] );
        deepEqual( breakpoint.position, 0 );

        // imagesLoaded instance
        deepEqual( instance.images[0].img, $image[0] );

    });

});

// --------------------------------------------------------------------------
// API / fail deferred
// --------------------------------------------------------------------------
// Breakpoint returns a deferred that gets passed the 'breakpoint' info
// 'breakpoint' has keys for 'current', 'all' and 'position'
// also returns and imagesLoaded instance
// --------------------------------------------------------------------------

asyncTest('Breakpoint Fail Deferred', 6, function () {

    var $image = $('<img data-small="http://adfadf.com/adfadf.jpg">');
    var test = $image.breakpoint();

    deepEqual( test.state(), 'pending' );

    test.fail(function (breakpoint, instance) {

        QUnit.start();
        deepEqual( test.state(), 'rejected' );
        deepEqual( breakpoint.current, 'small' );
        deepEqual( breakpoint.all, ['small', 'medium', 'large'] );
        deepEqual( breakpoint.position, 0 );

        // imagesLoaded instance
        deepEqual( instance.images[0].isLoaded, false );

    });

});

// --------------------------------------------------------------------------
// API / progress
// --------------------------------------------------------------------------
// Breakpoint runs a callback that gets passed the 'breakpoint' info
// 'breakpoint' has keys for 'current', 'all' and 'position'
// --------------------------------------------------------------------------

test('Test Progress', 10, function() {

    var $image = $('<img data-small="http://i.imgur.com/xrQHn.jpg"><img data-small="http://i.imgur.com/b3fBJ.jpg"><img data-small="http://i.imgur.com/xmSh2.jpg"><img data-small="http://i.imgur.com/iIpJm.jpg">');
    var dfd = $image.breakpoint();
    var progressCount = 0;

    QUnit.stop();

    dfd.progress(function ( breakpoint, instance, image ) {

        QUnit.start();

        ok( image.isLoaded, 'image is loaded');
        deepEqual( instance.images[progressCount].img, $image[progressCount] );

        progressCount = progressCount + 1;

        if ( progressCount >= $image.length ) {
            equal( progressCount, $image.length, 'progressed right amount of times' );
            deepEqual( breakpoint.current, 'small' );
        }

        QUnit.stop();

    });

    dfd.always(function () {
        QUnit.start();
    });

});


// --------------------------------------------------------------------------
// API / general callback
// --------------------------------------------------------------------------
// Breakpoint runs a callback that gets passed the 'breakpoint' info
// 'breakpoint' has keys for 'current', 'all' and 'position'
// --------------------------------------------------------------------------

asyncTest('Breakpoint Callback w/o Images', 3, function () {

    $.fn.breakpoint(function (breakpoint) {
        QUnit.start();
        deepEqual( breakpoint.current, 'small' );
        deepEqual( breakpoint.all, ['small', 'medium', 'large'] );
        deepEqual( breakpoint.position, 0 );
    });

});

// --------------------------------------------------------------------------
// API / image callback
// --------------------------------------------------------------------------
// Breakpoint runs a callback that gets passed the 'breakpoint' info
// 'breakpoint' has keys for 'current', 'all' and 'position'
// also returns and imagesLoaded instance
// --------------------------------------------------------------------------

asyncTest('Breakpoint Callback w/o Images', 4, function () {

    var $image = $('<img data-small="http://i.imgur.com/b3fBJ.jpg">');

    $image.breakpoint(function (breakpoint, instance) {

        QUnit.start();
        deepEqual( breakpoint.current, 'small' );
        deepEqual( breakpoint.all, ['small', 'medium', 'large'] );
        deepEqual( breakpoint.position, 0 );

        // imagesLoaded instance
        deepEqual( instance.images[0].img, $image[0] );

    });

});
