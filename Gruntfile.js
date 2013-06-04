'use strict';

module.exports = function (grunt) {

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            js: {
                files: '<%= jshint.files.src %>',
                tasks: ['jshint']
            }
        },
        connect: {
            server: {
                options: {
                    // keepalive: true,
                    base: 'test/'
                }
            }
        },
        jshint: {
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                noempty: true,
                trailing: true,
                undef: true,
                unused: true,
                quotmark: 'single',
                jquery: true,
                devel: false,
                browser: true,
                globals: {
                    define: true,
                    imagesLoaded: true,
                    EventEmitter: true
                }
            },
            files: {
                src: [
                    'jquery.breakpoint.js'
                ]
            }
        },
        sass: {
            test: {
                options: {
                    style: 'expanded'
                },
                src: ['./test/sass/style.scss'],
                dest: './test/css/style.css'
            }
        },
        copy: {
            main: {
                files: [
                    { src: ['jquery.breakpoint.js'], dest: 'test/js/vendor/jquery.breakpoint.js' }
                ]
            }
        },
        qunit: {
            functions: {
                options: {
                    urls: [ 'http://localhost:8000/functions.html' ],
                    page : {
                        viewportSize : { width: 300, height: 400 }
                    }
                }
            },
            resizeSmall: {
                options: {
                    urls: [ 'http://localhost:8000/resize.html' ],
                    page : {
                        viewportSize : { width: 300, height: 400 }
                    }
                }
            },
            resizeMedium: {
                options: {
                    urls: [ 'http://localhost:8000/resize.html' ],
                    page : {
                        viewportSize : { width: 700, height: 400 }
                    }
                }
            },
            resizeLarge: {
                options: {
                    urls: [ 'http://localhost:8000/resize.html' ],
                    page : {
                        viewportSize : { width: 1000, height: 400 }
                    }
                }
            }
        }
    });

    // for dev we need to lint js and compile sass
    grunt.registerTask('default', [
        'jshint',
        'copy',
        'sass:test',
        'connect',
        'qunit'
    ]);
};