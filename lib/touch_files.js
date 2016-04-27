/*
 * grunt-touch
 * https://github.com/fatfisz/grunt-touch
 *
 * Copyright (c) 2013 Paul Spencer
 * Copyright (c) 2016 Rafał Ruciński
 * Licensed under the MIT license.
 */

import touchFile from './touch_file';


export default function touchFiles(grunt, filepaths, touchOptions) {
  return Promise.all(
    filepaths.map((filepath) => touchFile(grunt, filepath, touchOptions))
  );
}
