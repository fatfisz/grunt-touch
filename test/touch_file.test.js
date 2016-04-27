'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('touchFile function', () => {
  let grunt;
  let gruntFileExists;
  let gruntFileMkdir;
  let gruntLogError;
  let gruntVerboseWriteln;
  let pathDirname;
  let touch;
  let touchFile;

  beforeEach(() => {
    gruntFileExists = sinon.stub();
    gruntFileMkdir = sinon.stub();
    gruntLogError = sinon.stub();
    gruntVerboseWriteln = sinon.stub();

    grunt = {
      file: {
        exists: gruntFileExists,
        mkdir: gruntFileMkdir,
      },
      log: {
        error: gruntLogError,
      },
      verbose: {
        writeln: gruntVerboseWriteln,
      },
    };

    pathDirname = sinon.stub();
    mockery.registerMock('path', {
      dirname: pathDirname,
    });

    touch = sinon.stub();
    mockery.registerMock('touch', touch);

    touchFile = require('../tmp/touch_file');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should export a function that accepts three arguments', () => {
    should(touchFile).be.a.Function();
    should(touchFile).have.length(3);
  });

  it('should return a promise', () => {
    const result = touchFile(grunt, 'filepath', 'touch options');

    should(result).be.a.Promise();
  });

  it('should print info about the touched file in the verbose mode', () => {
    touchFile(grunt, 'some filepath', 'touch options');

    should(gruntVerboseWriteln).be.calledOnce();
    should(gruntVerboseWriteln).be.calledWithExactly('Touching some filepath');
  });

  it('should create an appropriate directory if the file is missing', () => {
    pathDirname.returns('path dirname');
    gruntFileExists.returns(false);

    touchFile(grunt, 'some filepath', 'touch options');

    should(pathDirname).be.calledOnce();
    should(pathDirname).be.calledWithExactly('some filepath');
    should(gruntFileMkdir).be.calledOnce();
    should(gruntFileMkdir).be.calledWithExactly('path dirname');
  });

  it('should not create any directory if the file exists', () => {
    gruntFileExists.returns(true);

    touchFile(grunt, 'some filepath', 'touch options');

    should(gruntFileMkdir).not.be.called();
  });

  it('should call `touch` with appropriate arguments', () => {
    touchFile(grunt, 'some filepath', 'touch options');

    should(touch).be.calledOnce();
    should(touch).be.calledWithExactly(
      'some filepath',
      'touch options',
      sinon.match.func
    );
  });

  it('should resolve if `touch` calls back successfully', (done) => {
    touch.callsArg(2);

    const result = touchFile(grunt, 'some filepath', 'touch options');

    result.then(() => {
      done();
    });
  });

  it('should reject if `touch` calls back with an error', (done) => {
    touch.callsArgWith(2, 'some error');

    const result = touchFile(grunt, 'some filepath', 'touch options');

    result.catch(() => {
      should(gruntLogError).be.calledOnce();
      should(gruntLogError).be.calledWithExactly(
        'Error while touching some filepath',
        'some error'
      );

      done();
    });
  });
});
