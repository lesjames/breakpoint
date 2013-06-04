// does the correct source get set at different screen sizes
test('Source Setting', 5, function() {

    console.log('\n\nWindow width: ' + document.body.offsetWidth + 'px');

    var $img = $('.sources'),
        test1 = '',
        test2 = '',
        test3 = '',
        test4 = '',
        dataURI = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

    if ( document.body.offsetWidth < 660 ) {

        test1 = '/img/small.png';
        test2 = '/img/small.png';
        test3 = dataURI;
        test4 = '/img/small.png';

    } else if ( document.body.offsetWidth >= 660 && document.body.offsetWidth < 980 ) {

        test1 = '/img/medium.png';
        test2 = '/img/small.png';
        test3 = dataURI;
        test4 = '/img/small.png';

    } else if ( document.body.offsetWidth >= 980 ) {

        test1 = '/img/large.png';
        test2 = '/img/large.png';
        test3 = '/img/large.png';
        test4 = '/img/small.png';

    }

    $img.breakpoint();

    // when an image has a match for every layout
    deepEqual( $img.eq(0).attr('src'), test1, 'has all' );

    // when an image has a hole it should skip down
    deepEqual( $img.eq(1).attr('src'), test2, 'has hole' );

    // when an image only has large
    deepEqual( $img.eq(2).attr('src'), test3, 'has only large' );

    // when an image only has small
    deepEqual( $img.eq(3).attr('src'), test4, 'has only small' );

    // when an image has no match
    deepEqual( $img.eq(4).attr('src'), dataURI, 'has none' );

});
