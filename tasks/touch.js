'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var flatten = _interopDefault(require('lodash.flatten'));
var uniq = _interopDefault(require('lodash.uniq'));
var path = _interopDefault(require('path'));
var touch = _interopDefault(require('touch'));

var babelHelpers = {};

babelHelpers.objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};
function getFilepaths(files, match) {
  return uniq(flatten(files.map(function (file) {
    return match ? file.src : file.orig.src;
  })));
}

function touchFile(grunt, filepath, touchOptions) {
  grunt.verbose.writeln('Touching ' + filepath);

  if (!grunt.file.exists(filepath)) {
    grunt.file.mkdir(path.dirname(filepath));
  }

  return new Promise(function (resolve, reject) {
    touch(filepath, touchOptions, function (err) {
      if (err) {
        grunt.log.error('Error while touching ' + filepath, err);
        return reject();
      }

      resolve();
    });
  });
}

function touchFiles(grunt, filepaths, touchOptions) {
  return Promise.all(filepaths.map(function (filepath) {
    return touchFile(grunt, filepath, touchOptions);
  }));
}

function registerTask(grunt) {
  grunt.registerMultiTask('touch', 'Touch files', function touchTask() {
    var task = this;
    var done = task.async();

    var _task$options = task.options({
      match: false
    });

    var match = _task$options.match;
    var touchOptions = babelHelpers.objectWithoutProperties(_task$options, ['match']);

    if (match) {
      grunt.verbose.writeln('Touching only matched files');
    } else {
      grunt.verbose.writeln('Touching the original files');
    }

    var filepaths = getFilepaths(task.files, match);

    if (filepaths.length === 0) {
      grunt.log.writeln('Could not find any files to touch');
    }

    // Touch each file.
    touchFiles(grunt, filepaths, touchOptions).then(function () {
      done();
    })['catch'](function () {
      done(false);
    });
  });
}

module.exports = registerTask;