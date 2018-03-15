// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const elmPreset = (wcm /*: WebpackConfigMaker */) => {
  wcm.registerLoader('elm-webpack-loader', {
    options: {
      // start with `ELM_DEBUG=true yarn start` to enable the Elm Debugger
      debug: process.env.ELM_DEBUG,
      // TODO: investigate why murmur set "forceWatch: true" if using the onlyIfChanged plugin.
      forceWatch: wcm.isDevServer(),
      maxInstances: 1,
    },
  });

  wcm.registerLoader('elm-css-modules-loader', {});

  wcm.registerLoader('elm-hot-loader', {});

  const loaders = ['elm-css-modules-loader', 'elm-webpack-loader'];
  if (wcm.isHotModuleReplacementEnabled()) {
    loaders.unshift('elm-hot-loader');
  }

  wcm.addRule({
    extension: 'elm',
    loaders: loaders,
    exclude: 'node_modules',
    extract: true,
  });
};

module.exports = elmPreset;
