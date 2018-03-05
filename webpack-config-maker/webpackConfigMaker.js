const path = require('path');

module.exports = class WebpackConfigMaker {
  constructor() {
    this.entryPoints = ['src/main.js'];
    this.loaders = {};
    this.sourceDirectories = ['src'];
    this.setOutputPath('public/assets');
    this.setOutputPathRelativeToHost('/assets/');
    this.setFilenameTemplate('[name].bundle.js');
    this.setDevSourceMapType('cheap-source-map');
    this.setProdSourceMapType('source-map');
  }

  setSourceDirectories(dirs) {
    this.sourceDirectories = dirs;
  }

  setEntryPoints(entryPoints) {
    this.entryPoints = entryPoints;
  }

  setEntryPoint(entryPoint) {
    this.entryPoints = [entryPoint];
  }

  setOutputPath(outputPath) {
    this.outputPath = path.resolve(process.env.PWD, outputPath);
  }

  setOutputPathRelativeToHost(outputPublicPath) {
    if (!outputPublicPath.startsWith('/')) {
      outputPublicPath = '/' + outputPublicPath;
    }

    if (!outputPublicPath.endsWith('/')) {
      outputPublicPath = outputPublicPath + '/';
    }

    this.publicPath = outputPublicPath;
  }

  /* e.g. [name].bundle.js */
  setFilenameTemplate(template) {
    this.filename = template;
  }

  registerLoader(name, opts) {
    if (this.loaders.hasOwnProperty(name)) {
      throw new Error('A loader with that name has already been registered.');
    }
    this.loaders[name] = opts;
  }

  modifyLoader(name, opts) {}

  addPlugin(name, pluginInstance) {}

  removePlugin(name) {}

  addRule(opts, wrappingFunction) {
    wrappingFunction && wrappingFunction();
  }

  usePresets(presets) {}

  setDevSourceMapType(type) {
    this.devSourceMapType = type;
  }

  setProdSourceMapType(type) {
    this.prodSourceMapType = type;
  }

  generateWebpackConfig() {
    return {
      entry: this.entryPoints,
      resolve: {
        modules: ['node_modules', ...this.sourceDirectories],
      },
      output: {
        path: this.outputPath,
        publicPath: this.publicPath,
        filename: this.filename,
      },
      devtool:
        process.env.NODE_ENV === 'production'
          ? this.prodSourceMapType
          : this.devSourceMapType,
    };
  }
};
