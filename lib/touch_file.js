/*
 * grunt-touch
 * https://github.com/fatfisz/grunt-touch
 *
 * Copyright (c) 2013 Paul Spencer
 * Copyright (c) 2016 Rafał Ruciński
 * Licensed under the MIT license.
 */

import path from 'path';

import touch from 'touch';


export default function touchFile(grunt, filepath, touchOptions) {
  grunt.verbose.writeln(`Touching ${filepath}`);

  if (!grunt.file.exists(filepath)) {
    grunt.file.mkdir(path.dirname(filepath));
  }

  return new Promise((resolve, reject) => {
    touch(filepath, touchOptions, (err) => {
      if (err) {
        grunt.log.error(`Error while touching ${filepath}`, err);
        return reject();
      }

      resolve();
    });
  });
}
