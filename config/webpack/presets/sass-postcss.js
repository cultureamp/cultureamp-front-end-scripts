// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const sassPostCssPreset = (wcm /*: WebpackConfigMaker */) => {
  const preprocessorLoaders = ['postcss-loader', 'sass-loader'];

  wcm.registerLoader('css-loader', {
    loader: 'css-loader',
    options: {
      minimize: wcm.isProductionMode(),
      sourceMap: true,
    },
  });

  wcm.registerLoader('css-modules-loader', {
    loader: 'css-loader',
    options: {
      minimize: wcm.isProductionMode(),
      sourceMap: true,
      modules: true,
      importLoaders: preprocessorLoaders.length, // number of subsequent loaders to apply on `composes … from`
      localIdentName: '[name]__[local]--[hash:base64:5]',
    },
  });

  wcm.registerLoader('postcss-loader', {
    loader: 'postcss-loader',
    options: {
      ident: 'ca-front-end-scripts',
      plugins: [require('autoprefixer')],
      sourceMap: wcm.isDevelopmentMode() ? 'inline' : true,
    },
  });

  wcm.registerLoader('sass-loader', {
    loader: 'sass-loader',
    options: {
      sourceComments: true,
      sourceMap: true,
    },
  });

  wcm.addRule({
    extensions: ['scss', 'css'],
    loaders: ['css-modules-loader', ...preprocessorLoaders],
    exclude: 'node_modules',
    extract: true,
  });

  wcm.addRule({
    extension: 'css',
    loaders: ['css-loader'],
    include: 'node_modules',
    extract: true,
  });
};

module.exports = sassPostCssPreset;
