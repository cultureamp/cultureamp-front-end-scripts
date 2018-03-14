// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');
const fs = require('fs');
const path = require('path');

const babelPreset = (wcm /*: WebpackConfigMaker */) => {
  const pwd = wcm.getProjectDirectory();
  const customConfigPath = path.resolve(pwd, 'babel.config.js');
  const defaultConfig = require('../../babel/babel.config.js');
  const importedConfig = fs.existsSync(customConfigPath)
    ? // $FlowFixMe: flow doesn't know how to handle custom paths, but they're fine in NodeJS
      require(customConfigPath)
    : defaultConfig;

  const babelOptions = {
    plugins: [],
    ...importedConfig,
  };

  if (wcm.isCachingEnabled()) {
    babelOptions.cacheDirectory = wcm.getCacheDirectory();
  }

  if (wcm.isHotModuleReplacementEnabled()) {
    babelOptions.plugins.push('react-hot-loader/babel');
  }

  // don't output babel helpers inline, instead output require() calls
  // https://babeljs.io/docs/plugins/transform-runtime/
  // https://github.com/babel/babel-loader#babel-is-injecting-helpers-into-each-file-and-bloating-my-code
  babelOptions.plugins.push('transform-runtime');

  wcm.registerLoader('babel-loader', {
    options: babelOptions,
  });
  wcm.addRule({
    extensions: ['js', 'jsx'],
    loader: 'babel-loader',
    exclude: 'node_modules',
  });
};

module.exports = babelPreset;
