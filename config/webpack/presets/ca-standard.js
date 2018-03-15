// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const caStandard = (wcm /*: WebpackConfigMaker */) => {
  wcm.usePresets([require('./babel'), require('./sass-postcss')]);
};

module.exports = caStandard;
