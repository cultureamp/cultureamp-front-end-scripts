// @flow

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const WebpackConfigMaker = require('../../../../webpack-config-maker/');

const generateHtml = (wcm /*: WebpackConfigMaker */) => {
  wcm.addPlugin(
    'html-webpack-plugin',
    new HtmlWebpackPlugin({
      title: 'Culture Amp',
      template: require.resolve('./template.html'),
      alwaysWriteToDisk: true,
    })
  );

  wcm.addPlugin(
    'html-webpack-harddisk-plugin',
    new HtmlWebpackHarddiskPlugin()
  );
};

module.exports = generateHtml;
