'use strict';

var fs = require('fs');

var grunt = require('grunt');


exports.touch = {
  default: function(test) {
    test.expect(4);

    test.ok(grunt.file.exists('tmp/default123'), 'The file should exist');
    test.ok(grunt.file.exists('tmp/default456'), 'The file should exist');

    var now = new Date();
    var stat123 = fs.statSync('tmp/default123');
    var stat456 = fs.statSync('tmp/default456');
    test.ok(now - stat123.mtime < 5000, 'The file should have been touched');
    test.ok(now - stat456.mtime < 5000, 'The file should have been touched');

    test.done();
  },

  nested: function(test) {
    test.expect(2);

    test.ok(grunt.file.exists('tmp/first/second/nested123'), 'The file should exist');
    test.ok(grunt.file.exists('tmp/first/second/nested456'), 'The file should exist');

    test.done();
  },

  custom_time: function(test) {
    test.expect(4);

    test.ok(grunt.file.exists('tmp/custom123'), 'The file should exist');
    test.ok(grunt.file.exists('tmp/custom456'), 'The file should exist');

    var stat123 = fs.statSync('tmp/custom123');
    var stat456 = fs.statSync('tmp/custom456');
    test.ok(stat123.mtime - 100000 === 0, 'Expected 100000 as a modification date');
    test.ok(stat456.mtime - 100000 === 0, 'Expected 100000 as a modification date');

    test.done();
  },

  match: function(test) {
    test.expect(4);

    test.ok(grunt.file.exists('tmp/pattern123'), 'The file should exist');
    test.ok(grunt.file.exists('tmp/pattern456'), 'The file should exist');

    var stat123 = fs.statSync('tmp/pattern123');
    var stat456 = fs.statSync('tmp/pattern456');
    test.ok(stat123.mtime - 200000 === 0, 'Expected 200000 as a modification date');
    test.ok(stat456.mtime - 200000 === 0, 'Expected 200000 as a modification date');

    test.done();
  },

  ext_match: function(test) {
    test.expect(4);

    test.ok(grunt.file.exists('tmp/ext_pattern123'), 'The file should exist');
    test.ok(grunt.file.exists('tmp/ext_pattern456'), 'The file should exist');

    var stat123 = fs.statSync('tmp/ext_pattern123');
    var stat456 = fs.statSync('tmp/ext_pattern456');
    test.ok(stat123.mtime - 300000 === 0, 'Expected 300000 as a modification date');
    test.ok(stat456.mtime - 300000 === 0, 'Expected 300000 as a modification date');

    test.done();
  },
};
