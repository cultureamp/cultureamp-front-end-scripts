// @flow

const WebpackConfigMaker = require('../../../webpack-config-maker/');

const reactDevToolsPreset = (wcm /*: WebpackConfigMaker */) => {
  // Note: we're not using registerLoader and addRule because we want a weird `test` value for the rule.
  wcm.addDecorator('expose-react-loader', config => {
    config.module.rules.push({
      test: require.resolve('react'),
      loader: 'expose-loader?React',
    });
    return config;
  });
};

module.exports = reactDevToolsPreset;
