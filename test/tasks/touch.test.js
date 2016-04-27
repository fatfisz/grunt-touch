'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('Touch task registration function', () => {
  let getFilepaths;
  let touchFiles;
  let registerTask;

  beforeEach(() => {
    getFilepaths = sinon.stub();
    touchFiles = sinon.stub();

    mockery.registerMock('../get_filepaths', getFilepaths);
    mockery.registerMock('../touch_files', touchFiles);

    registerTask = require('../../tmp/tasks/touch');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should call register the multi task', () => {
    const registerMultiTask = sinon.spy();
    const grunt = {
      registerMultiTask,
    };

    registerTask(grunt);

    should(registerMultiTask).be.calledOnce();
    should(registerMultiTask).be.calledWithExactly(
      'touch',
      'Touch files',
      sinon.match.func
    );
  });

  describe('The task function', () => {
    let grunt;
    let gruntLogWriteln;
    let gruntVerboseWriteln;
    let taskThis;
    let thisAsync;
    let thisFiles;
    let thisOptions;
    let touchTask;

    beforeEach(() => {
      gruntLogWriteln = sinon.spy();
      gruntVerboseWriteln = sinon.spy();
      grunt = {
        registerMultiTask(name, info, task) {
          touchTask = task;
        },
        log: {
          writeln: gruntLogWriteln,
        },
        verbose: {
          writeln: gruntVerboseWriteln,
        },
      };

      registerTask(grunt);

      thisAsync = sinon.stub();
      thisFiles = [];
      thisOptions = sinon.stub().returns({});
      taskThis = {
        async: thisAsync,
        options: thisOptions,
        files: thisFiles,
      };

      getFilepaths.returns([]);
      touchFiles.returns(Promise.resolve());
    });

    it('should call the `async` method of `this`', () => {
      touchTask.call(taskThis);

      should(thisAsync).be.calledOnce();
      should(thisAsync).be.calledWithExactly();
    });

    it('should set proper default options', () => {
      touchTask.call(taskThis);

      should(thisOptions).be.calledOnce();
      should(thisOptions).be.calledWithExactly({
        match: false,
      });
    });

    it('should notify about matching patterns in the verbose mode when `match` is `true`', () => {
      thisOptions.returns({ match: true });

      touchTask.call(taskThis);

      should(gruntVerboseWriteln).be.called();
      should(gruntVerboseWriteln).be.calledWithExactly('Touching only matched files');
    });

    it('should notify about touching the original files in the verbose mode when `match` is `true`', () => {
      thisOptions.returns({ match: false });

      touchTask.call(taskThis);

      should(gruntVerboseWriteln).be.called();
      should(gruntVerboseWriteln).be.calledWithExactly('Touching the original files');
    });

    it('should call `getFilepaths` with appropriate arguments', () => {
      thisFiles.length = 0;
      thisFiles.push({
        src: 'source',
        orig: {
          src: 'original source',
        },
      });
      thisOptions.returns({ match: 'match value' });

      touchTask.call(taskThis);

      should(getFilepaths).be.calledOnce();
      should(getFilepaths.args[0]).have.length(2);
      should(getFilepaths.args[0][0]).be.equal(thisFiles);
      should(getFilepaths.args[0][1]).be.equal('match value');
    });

    it('should print a message if `getFilepaths` returns an empty array', () => {
      getFilepaths.returns([]);

      touchTask.call(taskThis);

      should(gruntLogWriteln).be.calledOnce();
      should(gruntLogWriteln).be.calledWithExactly('Could not find any files to touch');
    });

    it('should call `touchFiles` with appropriate arguments', () => {
      thisOptions.returns({
        match: 'omitted',
        ref: 'some ref',
        time: 'some time',
      });
      const specialFilepaths = ['first', 'second', 'third'];
      getFilepaths.returns(specialFilepaths);

      touchTask.call(taskThis);

      should(touchFiles).be.calledOnce();
      should(touchFiles.args[0]).have.length(3);
      should(touchFiles.args[0][0]).be.equal(grunt);
      should(touchFiles.args[0][1]).be.equal(specialFilepaths);
      should(touchFiles.args[0][2]).be.eql({
        ref: 'some ref',
        time: 'some time',
      });
    });

    it('should call `done` if `touchFiles` is resolved', (done) => {
      const taskDone = sinon.spy();
      thisAsync.returns(taskDone);
      touchFiles.returns(Promise.resolve());

      touchTask.call(taskThis);

      // Wait for the promise to be fulfilled
      setTimeout(() => {
        should(taskDone).be.calledOnce();
        should(taskDone).be.calledWithExactly();

        done();
      });
    });

    it('should call `done` if `touchFiles` is rejected', (done) => {
      const taskDone = sinon.spy();
      thisAsync.returns(taskDone);
      touchFiles.returns(Promise.reject());

      touchTask.call(taskThis);

      // Wait for the promise to be fulfilled
      setTimeout(() => {
        should(taskDone).be.calledOnce();
        should(taskDone).be.calledWithExactly(false);

        done();
      });
    });
  });
});
