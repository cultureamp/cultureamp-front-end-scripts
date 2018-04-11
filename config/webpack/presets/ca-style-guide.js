// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const path = require('path');

// TODO: ideally this preset should be hosted in the cultureamp-style-guide repo.
function caStyleGuidePreset(wcm /*: WebpackConfigMaker */) {
  wcm.usePresets([babelPreset, sassPreset, svgPreset]);
}

function babelPreset(wcm /*: WebpackConfigMaker */) {
  const pwd = wcm.getProjectDirectory();
  const customConfigPath = path.resolve(pwd, 'babel.config.js');
  const importedConfig = require('../../babel/babel.config.js');

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

  wcm.registerLoader('cultureamp-style-guide-babel-loader', {
    loader: 'babel-loader',
    options: babelOptions,
  });
  wcm.addRule({
    extensions: ['js', 'jsx'],
    loader: 'cultureamp-style-guide-babel-loader',
    include: getStyleGuidePath(wcm),
  });
}

function svgPreset(wcm /*: WebpackConfigMaker */) {
  const styleGuidePath = getStyleGuidePath(wcm);

  wcm.registerLoader('cultureamp-style-guide-svg-sprint-loader', {
    loader: require.resolve('svg-sprite-loader'),
    options: {
      symbolId: 'ca-icon-[name]',
      spriteModule: 'cultureamp-style-guide/util/svg-sprite.js',
    },
  });

  wcm.registerLoader('cultureamp-style-guide-svgo-loader', {
    loader: require.resolve('svgo-loader'),
    options: require(path.resolve(styleGuidePath, 'webpack/svgo.config.js')),
  });

  wcm.addRule({
    extensions: ['svg'],
    loaders: [
      'cultureamp-style-guide-svg-sprint-loader',
      'cultureamp-style-guide-svgo-loader',
    ],
    include: styleGuidePath,
  });
}

function sassPreset(wcm /*: WebpackConfigMaker */) {
  wcm.registerLoader('cultureamp-style-guide-sass-loader', {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  });
  wcm.registerLoader('cultureamp-style-guide-postcss-loader', {
    loader: 'postcss-loader',
    options: {
      ident: 'cultureamp-style-guide-postcss',
      plugins: () => [require('autoprefixer')()],
      sourceMap: true,
    },
  });
  wcm.registerLoader('cultureamp-style-guide-css-modules-loader', {
    loader: 'css-loader',
    options: {
      minimize: wcm.isProductionMode(),
      sourceMap: true,
      modules: true,
      importLoaders: 2, // number of subsequent loaders to apply on `composes … from`
      localIdentName: '[name]__[local]--[hash:base64:5]',
    },
  });
  wcm.addRule({
    extensions: ['scss', 'css'],
    loaders: [
      'cultureamp-style-guide-css-modules-loader',
      'cultureamp-style-guide-postcss-loader',
      'cultureamp-style-guide-sass-loader',
    ],
    include: getStyleGuidePath(wcm),
    extractText: true,
  });
}

function getStyleGuidePath(wcm /*: WebpackConfigMaker */) {
  const pwd = wcm.getProjectDirectory();
  return path.resolve(pwd, 'node_modules/cultureamp-style-guide/');
}

module.exports = caStyleGuidePreset;
