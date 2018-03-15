// @flow
const path = require('path');
const merge = require('lodash.merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/*::
type LoaderOpts = { loader?: string };
type RuleOpts = {
  extension?: string,
  extensions?: string[],
  loader?: string,
  loaders?: string[],
  include?: string | string[],
  exclude?: string | string[],
  extractText?: boolean,
  useFirstMatchingLoader?: boolean,
}
type ProcessedRuleOpts = {
  extensions: string[],
  loaders: string[],
  include?: string[],
  exclude?: string[],
  useFirstMatchingLoader?: boolean,
};
type WebpackConfig = any;
type Preset = WebpackConfigMaker => void;
type Decorator = WebpackConfig => WebpackConfig;
type SourceMapType =
  | null
  | 'eval'
  | 'cheap-eval-source-map'
  | 'cheap-module-eval-source-map'
  | 'eval-source-map'
  | 'cheap-source-map'
  | 'cheap-module-source-map'
  | 'inline-cheap-source-map'
  | 'inline-cheap-module-source-map'
  | 'source-map'
  | 'inline-source-map'
  | 'hidden-source-map'
  | 'nosources-source-map';
*/

class WebpackConfigMaker {
  /*::
  loaders: { [string]: LoaderOpts };
  plugins: { [string]: any };
  decorators: { [string]: Decorator };
  rules: ProcessedRuleOpts[];
  sourceDirectories: string[];
  entryPoints: string[];
  outputPath: string;
  publicPath: string;
  filename: string;
  prodSourceMapType: SourceMapType;
  devSourceMapType: SourceMapType;
  */
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

  isDevelopmentMode() {
    return process.env.NODE_ENV !== 'production';
  }

  isProductionMode() {
    return process.env.NODE_ENV === 'production';
  }

  isDevServer() {
    return path.basename(require.main.filename) === 'webpack-dev-server.js';
  }

  isCachingEnabled() {
    return false;
  }

  isHotModuleReplacementEnabled() {
    return false;
  }

  getProjectDirectory() {
    if (!process.env.PWD) {
      throw 'The environment variable $PWD was not set';
    }
    return process.env.PWD;
  }

  getCacheDirectory() {
    return path.resolve(this.getProjectDirectory(), 'tmp/cache');
  }

  setSourceDirectories(dirs /* :string[] */) {
    this.sourceDirectories = dirs;
  }

  setSourceDirectory(dir /* :string */) {
    this.sourceDirectories = [dir];
  }

  setEntryPoints(entryPoints /* :string[] */) {
    this.entryPoints = entryPoints;
  }

  setEntryPoint(entryPoint /* :string */) {
    this.entryPoints = [entryPoint];
  }

  setOutputPath(outputPath /* :string */) {
    this.outputPath = path.resolve(this.getProjectDirectory(), outputPath);
  }

  setOutputPathRelativeToHost(outputPublicPath /* :string */) {
    if (!outputPublicPath.startsWith('/')) {
      outputPublicPath = '/' + outputPublicPath;
    }

    if (!outputPublicPath.endsWith('/')) {
      outputPublicPath = outputPublicPath + '/';
    }

    this.publicPath = outputPublicPath;
  }

  /* e.g. [name].bundle.js */
  setFilenameTemplate(template /* :string */) {
    this.filename = template;
  }

  registerLoader(name /* :string */, opts /* :LoaderOpts */) {
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

  modifyLoader(name /* :string */, opts /* :LoaderOpts */) {
    merge(this.loaders[name], opts);
  }

  addPlugin(name /* :string */, pluginInstance /* :any */) {
    this.plugins[name] = pluginInstance;
  }

  removePlugin(name /* :string */) {
    delete this.plugins[name];
  }

  addRule(opts /* :RuleOpts */) {
    this.rules.push({
      loaders: this._processRuleLoaders(opts),
      extensions: this._processRuleExtensions(opts),
      include: this._processRuleIncludeOrExclude(opts.include),
      exclude: this._processRuleIncludeOrExclude(opts.exclude),
      extractText: opts.extractText,
      useFirstMatchingLoader: opts.useFirstMatchingLoader,
    });
  }

  _processRuleExtensions(opts /* :RuleOpts */) {
    if (opts.extension && !opts.extensions) {
      opts.extensions = [opts.extension];
    }
    if (!opts.extensions || opts.extensions.length === 0) {
      throw new Error(
        'You must specify at least one file extension to create a rule.'
      );
    }
    return opts.extensions;
  }

  _processRuleLoaders(opts /* :RuleOpts */) {
    if (opts.loader && !opts.loaders) {
      opts.loaders = [opts.loader];
    }

    if (!opts.loaders || opts.loaders.length === 0) {
      throw new Error('You must specify at least one loader to create a rule.');
    }

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
    return opts.loaders;
  }

  _processRuleIncludeOrExclude(
    value /* : typeof undefined | string | string[] */
  ) {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      return [value];
    }
  }

  _generateRule(rule /* :ProcessedRuleOpts */) {
    const output = {
      include: rule.include || this.sourceDirectories,
      exclude: rule.exclude,
      test: new RegExp(`\\.(${rule.extensions.join('|')})$`),
      use: rule.loaders.map(loader => this.loaders[loader]),
      oneOf: undefined,
    };

    if (rule.extractText) {
      let plugin = this.plugins['ExtractTextPlugin'];
      if (!plugin) {
        plugin = new ExtractTextPlugin({
          filename: '[name]-[contenthash].bundle.css',
          disable: this.isDevelopmentMode(),
        });
        this.addPlugin('ExtractTextPlugin', plugin);
      }

      output.use = plugin.extract({
        fallback: 'style-loader',
        use: output.use,
      });
    }

    if (rule.useFirstMatchingLoader) {
      output.oneOf = output.use;
      output.use = undefined;
    }

    return output;
  }

  usePreset(preset /* :string | Preset  */) {
    if (typeof preset === 'string') {
      try {
        // $FlowFixMe:
        preset = require(preset);
      } catch (err) {
        throw `Cannot load preset ${preset}: ${err}`;
      }
    }
    preset(this);
  }

  usePresets(presets /* :Preset[] */) {
    for (let preset of presets) {
      this.usePreset(preset);
    }
  }

  setDevSourceMapType(type /* :SourceMapType */) {
    this.devSourceMapType = type;
  }

  setProdSourceMapType(type /* :SourceMapType */) {
    this.prodSourceMapType = type;
  }

  addDecorator(name /* :string */, decoratorFn /* :Decorator */) {
    this.decorators[name] = decoratorFn;
  }

  removeDecorator(name /* :string */) {
    delete this.decorators[name];
  }

  generateWebpackConfig() /* :WebpackConfig */ {
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
      devtool: this.isProductionMode()
        ? this.prodSourceMapType
        : this.devSourceMapType,
      // TODO: make `devServer` options configurable.
      devServer: {
        contentBase: this.publicPath,
        overlay: {
          warnings: true,
          errors: true,
        },
        port: 8080,
        disableHostCheck: true,
        hot: this.isHotModuleReplacementEnabled(),
      },
    };
    // $FlowFixMe: flow doesn't correctly guess that Object.values() will give a type of `Decorator[]`.
    return decorateConfig(config, Object.values(this.decorators));
  }
}

function decorateConfig(
  config /* :WebpackConfig */,
  decorators /* :Decorator[] */
) {
  // Apply a series of transformations on a config, returning the new ("decorated") config.
  return decorators.reduce(
    (decoratedConfig, decorator) /* :WebpackConfig */ => {
      return decorator(decoratedConfig);
    },
    config
  );
}

module.exports = WebpackConfigMaker;
