/*
 * grunt-touch
 * https://github.com/mapsherpa/grunt-touch
 *
 * Copyright (c) 2013 Paul Spencer
 * Copyright (c) 2016 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    touch: {
      default: ['tmp/default123', 'tmp/default456'],
      empty: [],
      nested: ['tmp/first/second/nested123', 'tmp/first/second/nested456'],
      custom_time: {
        options: {
          time: 100000,
        },
        src: ['tmp/custom123', 'tmp/custom456'],
      },
      patterns_setup: [
        'tmp/pattern123',
        'tmp/pattern456',
        'tmp/ext_pattern123',
        'tmp/ext_pattern456',
      ],
      match: {
        options: {
          match: true,
          time: 200000,
        },
        src: ['tmp/pattern*'],
      },
      ext_match: {
        options: {
          match: true,
          time: 300000,
        },
        files: [{
          expand: true,
          cwd: 'tmp',
          src: 'ext_pattern*',
        }],
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'touch', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
};
