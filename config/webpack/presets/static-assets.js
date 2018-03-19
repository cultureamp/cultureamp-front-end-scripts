// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const staticAssetsPreset = (wcm /*: WebpackConfigMaker */) => {
  const fileLoaderOptions = {
    // TODO: investigate why murmur specifies a `context: 'app/assets` property here.
    name: wcm.isDevelopmentMode()
      ? '[path][name].[ext]'
      : '[path][name]-[hash].[ext]',
  };

  wcm.registerLoader('file-loader', {
    resourceQuery: '?forceAsset',
    options: fileLoaderOptions,
  });

  wcm.registerLoader('url-loader', {
    ...fileLoaderOptions,
    limit: 10000, // Only apply to files below this size (in bytes)
  });

  wcm.addRule({
    extensions: ['png', 'gif', 'jpg', 'svg'],
    loaders: ['file-loader', 'url-loader'],
    useFirstMatchingLoader: true,
  });

  wcm.addRule({
    extensions: ['eot', 'woff', 'woff2', 'ttf', 'swf', 'ico'],
    loader: 'file-loader',
  });
};

module.exports = staticAssetsPreset;
