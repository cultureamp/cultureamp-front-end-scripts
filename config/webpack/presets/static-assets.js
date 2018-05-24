// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const staticAssetsPreset = (wcm /*: WebpackConfigMaker */) => {
  const fileLoaderOptions /*: { name: string, limit?: number }*/ = {
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
    // Avoid object spread for VSCode ESLint integration: https://github.com/Microsoft/vscode-eslint/issues/464
    options: Object.assign(fileLoaderOptions, {
      limit: 10000, // Only apply to files below this size (in bytes)
    }),
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
