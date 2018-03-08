const path = require('path');
const merge = require('lodash.merge');

module.exports = class WebpackConfigMaker {
  constructor() {
    this.loaders = {};
    this.plugins = {};
    this.decorators = {};
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
    if (!opts) {
      opts = {};
    }
    if (!opts.loader) {
      opts.loader = name;
    }
    this.loaders[name] = opts;
  }

  modifyLoader(name, opts) {
    merge(this.loaders[name], opts);
  }

  addPlugin(name, pluginInstance) {
    this.plugins[name] = pluginInstance;
  }

  removePlugin(name) {
    delete this.plugins[name];
  }

  addRule(opts, wrappingFunction) {
    const rule = {};

    if (opts.extension && !opts.extensions) {
      opts.extensions = [opts.extension];
    }
    if (!opts.extensions || opts.extensions.length === 0) {
      throw new Error(
        'You must specify at least one file extension to create a rule.'
      );
    }
    rule.extensions = opts.extensions;

    if (opts.loader && !opts.loaders) {
      opts.loaders = [opts.loader];
    }

    if (!opts.loaders || opts.loaders.length === 0) {
      throw new Error('You must specify at least one loader to create a rule.');
    }

    if (opts.loaders) {
      let missingLoaders = [];
      for (let loader of opts.loaders) {
        if (!this.loaders.hasOwnProperty(loader)) {
          missingLoaders.push(loader);
        }
      }
      if (missingLoaders.length > 0) {
        throw new Error(
          `The following loaders have not been registered: ${missingLoaders.join(
            ', '
          )}`
        );
      }
      rule.loaders = opts.loaders;
    }

    if (opts.include) {
      if (Array.isArray(opts.include)) {
        rule.include = opts.include;
      }
      if (typeof opts.include === 'string') {
        rule.include = [opts.include];
      }
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

  _generateRule(rule) {
    const output = {};

    if (rule.include) {
      output.include =
        typeof rule.include === 'string' ? [rule.include] : rule.include;
    } else {
      output.include = this.sourceDirectories;
    }

    if (rule.exclude) {
      output.exclude =
        typeof rule.exclude === 'string' ? [rule.exclude] : rule.exclude;
    }

    output.test = new RegExp(`\\.(${rule.extensions.join('|')})$`);

    output.use = rule.loaders.map(loader => {
      let loaderOutput = {};
      loaderOutput['loader'] = loader;
      if (this.loaders[loader]) {
        loaderOutput['options'] = this.loaders[loader].options;
      }
      return loaderOutput;
    });

    return output;
  }

  usePresets(presets) {}

  setDevSourceMapType(type) {
    this.devSourceMapType = type;
  }

  setProdSourceMapType(type) {
    this.prodSourceMapType = type;
  }

  addDecorator(name, decoratorFn) {
    this.decorators[name] = decoratorFn;
  }

  removeDecorator(name) {
    delete this.decorators[name];
  }

  generateWebpackConfig() {
    const config = {
      entry: this.entryPoints,
      resolve: {
        modules: ['node_modules', ...this.sourceDirectories],
      },
      output: {
        path: this.outputPath,
        publicPath: this.publicPath,
        filename: this.filename,
      },
      module: {
        rules: this.rules.map(rule => this._generateRule(rule)),
      },
      plugins: Object.values(this.plugins),
      devtool:
        process.env.NODE_ENV === 'production'
          ? this.prodSourceMapType
          : this.devSourceMapType,
    };
    return decorateConfig(config, Object.values(this.decorators));
  }
};

function decorateConfig(config, decorators) {
  // Apply a series of transformations on a config, returning the new ("decorated") config.
  return decorators.reduce((decoratedConfig, decorator) => {
    return decorator(decoratedConfig);
  }, config);
}
