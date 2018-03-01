var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var jestPreset = require('babel-preset-jest');
var sourceMapPath = require('./sourceMapPath');
var shouldBabelPreprocess = require('./shouldBabelPreprocess');
var preprocessStylesheet = require('./preprocessStylesheet');
var babelConfig = require(path.resolve(
  'node_modules/cultureamp-front-end-scripts/config/babel/babel.config.js'
));

module.exports = {
  process: function(src, filename) {
    /*
      Since Jest runs JavaScript files independent of Webpack, we must
      pre-process them to simulate the work Webpack does (Babel, CSS modules,
      etc.). To get a better idea of what's going on here, see:
      https://facebook.github.io/jest/docs/webpack.html
    */
    if (/\.s?css$/.test(filename)) return preprocessStylesheet(src, filename);
    if (/\.(jpg|png|gif|svg|elm)$/.test(filename))
      return (
        'module.exports = ' + JSON.stringify(path.basename(filename)) + ';'
      );

    // adapted from babel-jest's preprocessor
    // https://github.com/facebook/jest/blob/master/packages/babel-jest/src/index.js
    if (shouldBabelPreprocess(filename)) {
      var babelOpts = {
        ...babelConfig,
        presets: [
          ...babelConfig.presets,
          jestPreset,
          ["env", {
            "targets": {
              "node": "current"
            }
          }]
        ],
        filename: filename,
        sourceMap: true,
        auxiliaryCommentBefore: ' istanbul ignore next ',
        retainLines: true,
      };

      var result = babel.transform(src, babelOpts);

      fs.writeFileSync(sourceMapPath(filename), JSON.stringify(result.map));

      return result.code;
    } else {
      return src;
    }
  },
};
