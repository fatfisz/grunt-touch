'use strict';

const mockery = require('mockery');
const should = require('should/as-function');


describe('Filepath getter function', () => {
  let getFilepaths;

  beforeEach(() => {
    getFilepaths = require('../tmp/get_filepaths');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should export a function that accepts two arguments', () => {
    should(getFilepaths).be.a.Function();
    should(getFilepaths).have.length(2);
  });

  it('should use the processed source if `match` is `true`', () => {
    const result = getFilepaths([{
      src: 'processed',
      orig: {
        src: 'original',
      },
    }], true);

    should(result).be.eql(['processed']);
  });

  it('should use the original source if `match` is `false`', () => {
    const result = getFilepaths([{
      src: 'processed',
      orig: {
        src: 'original',
      },
    }], false);

    should(result).be.eql(['original']);
  });

  it('should flatten the sources', () => {
    const result = getFilepaths([{
      src: ['first', 'second'],
    }, {
      src: ['third'],
    }], true);

    should(result).be.eql(['first', 'second', 'third']);
  });

  it('should return unique sources', () => {
    const result = getFilepaths([{
      src: ['first', 'second', 'first'],
    }, {
      src: ['second', 'third', 'first'],
    }], true);

    should(result).be.eql(['first', 'second', 'third']);
  });
});
