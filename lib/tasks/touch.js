/*
 * grunt-touch
 * https://github.com/fatfisz/grunt-touch
 *
 * Copyright (c) 2013 Paul Spencer
 * Copyright (c) 2016 Rafał Ruciński
 * Licensed under the MIT license.
 */

import getFilepaths from '../get_filepaths';
import touchFiles from '../touch_files';


export default function registerTask(grunt) {
  grunt.registerMultiTask('touch', 'Touch files', function touchTask() {
    const task = this;
    const done = task.async();
    const { match, ...touchOptions } = task.options({
      match: false,
    });

    if (match) {
      grunt.verbose.writeln('Touching only matched files');
    } else {
      grunt.verbose.writeln('Touching the original files');
    }

    const filepaths = getFilepaths(task.files, match);

    if (filepaths.length === 0) {
      grunt.log.writeln('Could not find any files to touch');
    }

    // Touch each file.
    touchFiles(grunt, filepaths, touchOptions)
      .then(() => {
        done();
      })
      .catch(() => {
        done(false);
      });
  });
}
