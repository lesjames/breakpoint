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
                dest: './test/style.css'
            }
        },
        uglify: {
            './test/jquery.breakpoint.js': './jquery.breakpoint.js'
        },
        qunit: {
            all: {
              options: {
                urls: [
                  'http://localhost:8000/index.html'
                ]
              }
            }
        }
    });

    // for dev we need to lint js and compile sass
    grunt.registerTask('default', [
        'jshint',
        'uglify',
        'sass:test',
        'connect',
        'qunit'
    ]);
};