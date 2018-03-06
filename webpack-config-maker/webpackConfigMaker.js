const path = require('path');

module.exports = class WebpackConfigMaker {
  constructor() {
    this.loaders = {};
    this.rules = [];
    this.setEntryPoint('src/main.js');
    this.setSourceDirectories(['src']);
    this.setOutputPath('public/assets');
    this.setOutputPathRelativeToHost('/assets/');
    this.setFilenameTemplate('[name].bundle.js');
    this.setDevSourceMapType('cheap-source-map');
    this.setProdSourceMapType('source-map');
  }

  setSourceDirectories(dirs) {
    this.sourceDirectories = dirs;
  }

  setSourceDirectory(dir) {
    this.sourceDirectories = [dir];
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

  modifyLoader(name, opts) {
    this.loaders[name] = {
      ...this.loaders[name],
      ...opts,
    };
  }

  addPlugin(name, pluginInstance) {}

  removePlugin(name) {}

  addRule(opts, wrappingFunction) {
    if (!opts.extension && (!opts.extensions || opts.extensions.length === 0)) {
      throw new Error(
        'You must specify at least one file extension to create a rule.'
      );
    }

    if (!opts.loader && (!opts.loaders || opts.loaders.length === 0)) {
      throw new Error('You must specify at least one loader to create a rule.');
    }

    const rule = {};

    if (!opts.include || opts.include.length === 0) {
      rule.include = this.sourceDirectories;
    }

    if (opts.exclude) {
      if (Array.isArray(opts.exclude)) {
        rule.exclude = opts.exclude;
      }
      if (typeof opts.exclude === 'string') {
        rule.exclude = [opts.exclude];
      }
    }

    // TODO: wrappingFunction && wrappingFunction();

    this.rules.push(rule);
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
