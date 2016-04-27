# grunt-touch

> Touch files

A grunt wrapper for [node-touch](https://github.com/isaacs/node-touch).

## Install

```shell
npm install grunt-touch --save-dev
```

## Usage

```js
grunt.loadNpmTasks('grunt-touch');

grunt.initConfig({
  touch: ['file.js'],
});
```

## Examples

### Match existing files

```js
grunt.loadNpmTasks('grunt-touch');

grunt.initConfig({
  touch: {
    options: {
      match: true,
    },
    target: ['match_*.js'],
  },
});
```

### Custom date

```js
grunt.loadNpmTasks('grunt-touch');

grunt.initConfig({
  touch: {
    options: {
      time: Date.now() + 5000, // Set time to 5 seconds in the future
    },
    target: ['file.js'],
  },
});
```

## Options

See [node-touch options](https://github.com/isaacs/node-touch#options).

Additionally the following option is supported:

### match
Type: `Boolean`
Default value: `false`

By default a list of file paths is expected - those files will be touched.
If you want to match the files by using patterns instead, set `match` to `true`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2013 Paul Spencer. Copyright (c) 2016 Rafał Ruciński. Licensed under the MIT license.
