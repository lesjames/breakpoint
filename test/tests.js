// does the source of the image get set?
test('Page defaults to small', 1, function() {

    var $img = $('.test-1');
    $img.breakpoint();

    deepEqual( $img.attr('src'), '/img/small.png', 'set source' );

});

// does the return have correct information?
test('Test breakpoint return', 11, function() {

    var $img = $('.test-2');
    var dfd = $img.breakpoint();

    QUnit.stop();

    dfd.done(function (data) {

        QUnit.start();

        deepEqual( data.breakpoint.current, 'small', 'current label' );
        deepEqual( data.breakpoint.all, ['small', 'medium'], 'label array' );
        deepEqual( data.breakpoint.position, 0, 'current position' );

        deepEqual( data.images.all.length, 1, 'all set length' );
        deepEqual( data.images.all[0], $img[0], 'all image match' );

        deepEqual( data.images.broken.length, 0, 'broken set length' );
        deepEqual( data.images.broken[0], undefined, 'broken image match' );

        deepEqual( data.images.skipped.length, 0, 'skipped set length' );
        deepEqual( data.images.skipped[0], undefined, 'skipped image match' );

        deepEqual( data.images.proper.length, 1, 'proper set length' );
        deepEqual( data.images.proper[0], $img[0], 'proper image match' );


    });

});

// does the image get skipped if no source is found?
test('Test skipped', 3, function() {

    var $img = $('.test-3');
    var dfd = $img.breakpoint();

    equal( $img.attr('src'), undefined, 'no source' );

    QUnit.stop();

    dfd.done(function (data) {

        QUnit.start();

        deepEqual( data.images.skipped.length, 1, 'skipped set length' );
        deepEqual( data.images.skipped[0], $img[0], 'skipped image match' );

    });

});

// does the image mark as broken if the source 404s?
test('Test broken', 3, function() {

    var $img = $('.test-4');
    var dfd = $img.breakpoint();

    equal( $img.attr('src'), '/img/404.png', 'source was set' );

    QUnit.stop();

    dfd.fail(function (data) {

        QUnit.start();

        deepEqual( data.images.broken.length, 1, 'broken set length' );
        deepEqual( data.images.broken[0], $img[0], 'broken image match' );

    });

});

// if one image in a set 404s does the other image still resolve?
test('Test partial broken', 8, function() {

    var $img = $('.test-5');
    var dfd = $img.breakpoint();

    equal( $img.eq(0).attr('src'), '/img/small.png', 'source was set to small' );
    equal( $img.eq(1).attr('src'), '/img/404.png', 'source was set to 404' );

    QUnit.stop();

    dfd.fail(function (data) {

        QUnit.start();

        deepEqual( data.images.all.length, 2, 'all set length' );
        deepEqual( data.images.all, [$img[0], $img[1]], 'all image match' );

        deepEqual( data.images.broken.length, 1, 'broken set length' );
        deepEqual( data.images.broken[0], $img[1], 'broken image match' );

        deepEqual( data.images.proper.length, 1, 'proper set length' );
        deepEqual( data.images.proper[0], $img[0], 'proper image match' );

    });

});
