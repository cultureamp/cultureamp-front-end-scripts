module.exports = class WebpackConfigMaker {
  constructor() {
    this.loaders = {};
  }

  setSrcDirectories(dirs) {}

  setEntryPoints(entryPoints) {}

  setOutputPath(path) {}

  setOutputPathRelativeToHost(path) {}

  /* e.g. [name].bundle.js */
  setFilenameTemplate(template) {}

  registerLoader(name, opts) {}

  modifyLoader(name, opts) {}

  addPlugin(name, pluginInstance) {}

  removePlugin(name) {}

  addRule(opts, wrappingFunction) {
    wrappingFunction && wrappingFunction();
  }

  usePresets(presets) {}

  setSourceMapType(type) {}

  generateWebpackConfig() {}
};
