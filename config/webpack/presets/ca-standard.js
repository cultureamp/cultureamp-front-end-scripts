// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const caStandard = (wcm /*: WebpackConfigMaker */) => {
  wcm.usePresets([
    require('./babel'),
    require('./sass-postcss'),
    require('./elm'),
    require('./static-assets'),
    require('./elm'),
    require('./react-dev-tools'),
  ]);
};

module.exports = caStandard;
