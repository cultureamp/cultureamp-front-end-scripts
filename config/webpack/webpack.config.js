const path = require('path');
const WebpackConfigMaker = require('../../webpack-config-maker/');

const configMaker = new WebpackConfigMaker();
configMaker.usePresets([require('./presets/ca-standard.js')]);

module.exports = configMaker.generateWebpackConfig();
