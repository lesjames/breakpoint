console.log('\n\nWindow width: ' + document.body.offsetWidth + 'px\n');

var $img = $('.sources'),
    test1 = '',
    test2 = '',
    test3 = '',
    test4 = '',
    test5 = '',
    test6 = '',
    dataURI = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

if ( document.body.offsetWidth < 660 ) {

    test1 = '/img/small.png';
    test2 = '/img/small.png';
    test3 = dataURI;
    test4 = '/img/small.png';
    test5 = 'small';
    test6 = 0;

} else if ( document.body.offsetWidth >= 660 && document.body.offsetWidth < 980 ) {

    test1 = '/img/medium.png';
    test2 = '/img/small.png';
    test3 = dataURI;
    test4 = '/img/small.png';
    test5 = 'medium';
    test6 = 1;

} else if ( document.body.offsetWidth >= 980 ) {

    test1 = '/img/large.png';
    test2 = '/img/large.png';
    test3 = '/img/large.png';
    test4 = '/img/small.png';
    test5 = 'large';
    test6 = 2;

}

// does the source of the image get set?
test('Source Setting', 5, function() {

    $img.breakpoint();

    // when an image has a match for every layout
    deepEqual( $img.eq(0).attr('src'), test1, 'has all' );

    // when an image has a hole it should skip down
    deepEqual( $img.eq(1).attr('src'), test2, 'has hole' );

    // when an image only has large
    deepEqual( $img.eq(2).attr('src'), test3, 'has only large' );

    // when an image only has large
    deepEqual( $img.eq(3).attr('src'), test4, 'has only small' );

    // when an image has no match
    deepEqual( $img.eq(4).attr('src'), dataURI, 'has none' );

});

// does the deferred have correct breakpoint information?
test('Breakpoint Deferred', 3, function() {

    QUnit.stop();

    var dfd = $(document).breakpoint();

    dfd.done(function ( breakpoint ) {

        QUnit.start();

        deepEqual( breakpoint.current, test5, 'current label' );
        deepEqual( breakpoint.all, ['small', 'medium', 'large'], 'label array' );
        deepEqual( breakpoint.position, test6, 'current position' );

    });

});

// does the callback have correct breakpoint information?
test('Breakpoint Callback', 3, function() {

    QUnit.stop();

    $(document).breakpoint(function ( breakpoint ) {

        QUnit.start();

        deepEqual( breakpoint.current, test5, 'current label' );
        deepEqual( breakpoint.all, ['small', 'medium', 'large'], 'label array' );
        deepEqual( breakpoint.position, test6, 'current position' );

    });

});

// read the correct breakpoint info
test('Read Breakpoint', 1, function () {

    var test = $.fn.breakpoint({ debug: true });

    var breakpoint = test.updateBreakpoint();

    deepEqual( breakpoint.current, test5, 'current label' );

});

// remove quotes function
test('Remove Quotes', 4, function () {

    var test = $.fn.breakpoint({ debug: true });

    deepEqual( test.removeQuotes('yep'), 'yep');
    deepEqual( test.removeQuotes("yep"), 'yep');
    deepEqual( test.removeQuotes("'yep'"), 'yep');
    deepEqual( test.removeQuotes('"yep"'), 'yep');

});
