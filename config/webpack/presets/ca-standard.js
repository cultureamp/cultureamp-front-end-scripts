// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const caStandard = (wcm /*: WebpackConfigMaker */) => {
  wcm.usePresets([require('./babel')]);
};

module.exports = caStandard;
