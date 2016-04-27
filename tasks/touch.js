/*
 * grunt-touch
 * https://github.com/fatfisz/grunt-touch
 *
 * Copyright (c) 2013 Paul Spencer
 * Copyright (c) 2016 Rafał Ruciński
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

var flatten = require('lodash.flatten');
var uniq = require('lodash.uniq');
var touch = require('touch');


module.exports = function(grunt) {
  grunt.registerMultiTask('touch', 'Touch files', function() {
    var task = this;
    var done = task.async();
    var options = task.options({
      match: false,
    });

    if (options.match) {
      grunt.verbose.writeln('Touching only matched files');
    } else {
      grunt.verbose.writeln('Touching the original files');
    }

    var filepaths = uniq(flatten(task.files.map(function(file) {
      return options.match ? file.src : file.orig.src;
    })));

    if (filepaths.length === 0) {
      grunt.log.writeln('Could not find any files to touch.');
    }

    // Touch each file.
    Promise.all(filepaths.map(function(filepath) {
      grunt.verbose.writeln('Touching ' + filepath);
      if (!grunt.file.exists(filepath)) {
        grunt.file.mkdir(path.dirname(filepath));
      }

      return new Promise(function(resolve, reject) {
        touch(filepath, options, function(err) {
          if (err) {
            grunt.log.error('Error while touching file: ', err);
            return reject();
          }
          resolve();
        });
      });
    }))
      .then(function() {
        done();
      })
      .catch(function(err) {
        done(false);
      });
  });

};
