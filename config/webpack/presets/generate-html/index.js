// @flow

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackConfigMaker = require('../../../../webpack-config-maker/');

const generateHtml = (wcm /*: WebpackConfigMaker */) => {
  wcm.addPlugin(
    'html-webpack-plugin',
    new HtmlWebpackPlugin({
      title: 'Culture Amp',
      template: require.resolve('./template.html'),
    })
  );
};

module.exports = generateHtml;
