/*
 * grunt-touch
 * https://github.com/fatfisz/grunt-touch
 *
 * Copyright (c) 2013 Paul Spencer
 * Copyright (c) 2016 Rafał Ruciński
 * Licensed under the MIT license.
 */

import flatten from 'lodash.flatten';
import uniq from 'lodash.uniq';


export default function getFilepaths(files, match) {
  return uniq(flatten(files.map(
    (file) => (match ? file.src : file.orig.src)
  )));
}
