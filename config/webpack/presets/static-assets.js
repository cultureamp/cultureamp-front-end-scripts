// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const staticAssetsPreset = (wcm /*: WebpackConfigMaker */) => {
  const fileLoaderOptions = {
    // TODO: investigate why murmur specifies a `context: 'app/assets` property here.
    name: wcm.getFilenameTemplate(),
  };

  wcm.registerLoader('file-loader', {
    options: fileLoaderOptions,
  });

  wcm.registerLoader('forced-file-loader', {
    loader: 'file-loader',
    resourceQuery: '?forceAsset',
    options: fileLoaderOptions,
  });

  wcm.registerLoader('url-loader', {
    options: {
      ...fileLoaderOptions,
      limit: 10000, // Only apply to files below this size (in bytes)
    },
  });

  wcm.addRule({
    extensions: ['png', 'gif', 'jpg', 'svg'],
    loaders: ['forced-file-loader', 'url-loader'],
    useFirstMatchingLoader: true,
  });

  wcm.addRule({
    extensions: ['eot', 'woff', 'woff2', 'ttf', 'swf', 'ico'],
    loader: 'file-loader',
  });
};

module.exports = staticAssetsPreset;
