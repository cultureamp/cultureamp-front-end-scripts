module.exports = class WebpackConfigMaker {
  constructor() {
    this.loaders = {};
  }

  registerLoader(name, opts) {}

  modifyLoader(name, opts) {}

  addPlugin(name, pluginInstance) {}

  removePlugin(name) {}

  addRule(opts) {}

  usePresets(presets) {}

  generateWebpackConfig() {}
};
