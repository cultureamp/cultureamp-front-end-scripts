// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const caStandard = (wcm /*: WebpackConfigMaker */) => {
  wcm.usePresets([
    require('./babel'),
    require('./sass-postcss'),
    require('./elm'),
    require('./static-assets'),
    require('./ca-style-guide'),
    require('./react-dev-tools'),
    require('./generate-html'),
  ]);
};

module.exports = caStandard;
