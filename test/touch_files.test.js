'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('touchFiles function', () => {
  let touchFile;
  let touchFiles;

  beforeEach(() => {
    touchFile = sinon.stub().returns(Promise.resolve());

    mockery.registerMock('./touch_file', touchFile);

    touchFiles = require('../tmp/touch_files');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should export a function that accepts three arguments', () => {
    should(touchFiles).be.a.Function();
    should(touchFiles).have.length(3);
  });

  it('should return a promise', () => {
    const result = touchFiles('grunt', [], 'touch options');

    should(result).be.a.Promise();
  });

  it('should call `touchFile` with appropriate arguments', () => {
    const filepaths = ['first', 'second', 'third'];

    touchFiles('grunt', filepaths, 'touch options');

    should(touchFile).be.calledThrice();
    should(touchFile).be.calledWithExactly('grunt', 'first', 'touch options');
    should(touchFile).be.calledWithExactly('grunt', 'second', 'touch options');
    should(touchFile).be.calledWithExactly('grunt', 'third', 'touch options');
  });

  it('should resolve when no errors have occurred', (done) => {
    touchFile.returns(Promise.resolve());

    const result = touchFiles('grunt', [1, 2, 3], 'touch options');

    result.then(() => {
      done();
    });
  });

  it('should reject when at least one error has occurred', (done) => {
    touchFile.returns(Promise.resolve());
    touchFile.onThirdCall().returns(Promise.reject());

    const result = touchFiles('grunt', [1, 2, 3], 'touch options');

    result.catch(() => {
      done();
    });
  });
});
