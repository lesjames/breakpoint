// does the deferred wait for the image to be loaded?
// does the instance match the image set?
test('Test imagesLoaded', 4, function() {

    var $img = $('.resolved');
    var dfd = $img.breakpoint();

    deepEqual( dfd.state(), 'pending', 'dfd is pending' );

    QUnit.stop();

    dfd.done(function ( breakpoint, instance ) {

        QUnit.start();

        deepEqual( dfd.state(), 'resolved', 'dfd is resolved' );
        deepEqual( instance.isComplete, true, 'images loaded is complete' );
        deepEqual( instance.elements[0], $img[0], 'image in instance matches' );

    });

});

// does the deferred fail on a broken image?
test('Test Broken Image', 4, function() {

    var $img = $('.fail');
    var dfd = $img.breakpoint();

    deepEqual( dfd.state(), 'pending', 'dfd is pending' );

    QUnit.stop();

    dfd.fail(function ( breakpoint, instance ) {

        QUnit.start();

        deepEqual( dfd.state(), 'rejected', 'dfd is rejected' );
        deepEqual( instance.isComplete, true, 'images loaded is complete' );
        deepEqual( instance.elements[0], $img[0], 'image in instance matches' );

    });

});

// does always fire on a failed image?
test('Test Always', 3, function() {

    var $img = $('.always');
    var dfd = $img.breakpoint();

    deepEqual( dfd.state(), 'pending', 'dfd is pending' );

    QUnit.stop();

    dfd.always(function ( breakpoint, instance ) {

        QUnit.start();

        ok( true, 'always fired' );
        deepEqual( instance.elements[0], $img[0], 'image in instance matches' );

    });

});


// test progress of 4 images
test('Test Progress', 5, function() {

    var $img = $('.progress');
    var dfd = $img.breakpoint();
    var progressCount = 0;

    QUnit.stop();

    dfd.progress(function ( breakpoint, instance, image ) {

        QUnit.start();

        ok( image.isLoaded, 'image is loaded');

        progressCount = progressCount + 1;

        if ( progressCount >= $img.length ) {
            equal( progressCount, $img.length, 'progressed right amount of times' );
        }

        QUnit.stop();

    });

    dfd.always(function () {
        QUnit.start();
    });

});

