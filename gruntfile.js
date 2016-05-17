/*
 * grunt-touch
 * https://github.com/fatfisz/grunt-touch
 *
 * Copyright (c) 2013 Paul Spencer
 * Copyright (c) 2016 Rafał Ruciński
 * Licensed under the MIT license.
 */

'use strict';

const loadGruntTasks = require('load-grunt-tasks');
const rollupPluginBabel = require('rollup-plugin-babel');


module.exports = function register(grunt) {
  loadGruntTasks(grunt);

  grunt.initConfig({
    eslint: {
      all: ['lib', 'test'],
    },

    clean: {
      all: ['tasks', 'tmp'],
    },

    rollup: {
      all: {
        options: {
          external: [
            'lodash.flatten',
            'lodash.uniq',
            'path',
            'touch',
          ],
          plugins: [
            rollupPluginBabel(),
          ],
          format: 'cjs',
        },
        files: {
          'tasks/touch.js': 'lib/tasks/touch.js',
        },
      },
    },

    babel: {
      all: {
        files: [{
          expand: true,
          cwd: 'lib/',
          src: '**/*.js',
          dest: 'tmp/',
        }],
      },
    },

    mochaTest: {
      test: {
        options: {
          timeout: 500,
        },
        src: [
          'test/boot.js',
          'test/**/*.test.js',
        ],
      },
    },
  });

  grunt.registerTask('prepublish', ['eslint', 'clean', 'rollup']);
  grunt.registerTask('test', ['prepublish', 'babel', 'mochaTest']);

  grunt.registerTask('default', ['test']);
};
