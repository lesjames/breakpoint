module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                options: {
                    targetDir: 'static/components'
                }
            }
        },

        clean: ["components"],

        jshint: {
            files: ['static/js/lib/jquery.breakpoint.js', 'static/js/src/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true
                }
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            init: {
                src: ['static/components/modernizr/modernizr.js'],
                dest: 'static/js/init.min.js'
            },
            script: {
                src: ['static/js/src/**/*.js'],
                dest: 'static/js/script.min.js'
            }
        },

        uglify: {
            init: {
                files: {
                    '<%= concat.init.dest %>': ['<%= concat.init.src %>']
                }
            },
            script: {
                files: {
                    '<%= concat.script.dest %>': ['<%= concat.script.src %>']
                }
            }
        },

        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                src: ['static/sass/**/*.scss'],
                dest: 'static/css/style.css'
            },
            prod: {
                options: {
                    style: 'compressed'
                },
                src: ['static/sass/**/*.scss'],
                dest: 'static/css/style.css'
            }
        },

        watch: {
            files: ['<%= jshint.files %>', '<%= sass.dev.src %>'],
            tasks: 'default'
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('default', ['jshint', 'concat', 'sass:dev']);
    grunt.registerTask('install', ['bower:install', 'clean']);
    grunt.registerTask('release', ['jshint', 'uglify', 'sass:prod']);

};