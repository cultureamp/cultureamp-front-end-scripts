const WebpackConfigMaker = require('./WebpackConfigMaker');

describe('our webpack config thing', () => {
  describe('setting an entry point', () => {
    test('has a default of src/main.js', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.entry).toEqual(['src/main.js']);
    });

    test('allows setting a single entry point', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setEntryPoint('src/app/app.js');

      const config = wcm.generateWebpackConfig();
      expect(config.entry).toEqual(['src/app/app.js']);
    });

    test('allows setting multiple entry points', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setEntryPoints(['src/app/app.js', 'src/main.js']);

      const config = wcm.generateWebpackConfig();
      expect(config.entry).toEqual(['src/app/app.js', 'src/main.js']);
    });
  });

  describe('setting source directories', () => {
    test('has a default of src', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.resolve.modules).toEqual(['node_modules', 'src']);
    });

    test('allows changing the src dir', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setSourceDirectories(['app/client/modules', 'lib/client/modules']);

      const config = wcm.generateWebpackConfig();
      expect(config.resolve.modules).toEqual([
        'node_modules',
        'app/client/modules',
        'lib/client/modules',
      ]);
    });
  });

  describe('setting the output path', () => {
    let pwd;

    beforeEach(() => {
      pwd = process.env.PWD;
      process.env.PWD = '/user/workspace';
    });

    test('has a default of public/assets', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.output.path).toEqual('/user/workspace/public/assets');
    });

    test('allows changing the output path', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setOutputPath('public/bubble-tea');

      const config = wcm.generateWebpackConfig();
      expect(config.output.path).toEqual('/user/workspace/public/bubble-tea');
    });

    afterEach(() => {
      process.env.PWD = pwd;
    });
  });

  describe('setting the output public path', () => {
    test('has a default of /assets', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.output.publicPath).toEqual('/assets/');
    });

    test('allows changing the public path', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setOutputPathRelativeToHost('/js/');

      const config = wcm.generateWebpackConfig();
      expect(config.output.publicPath).toEqual('/js/');
    });

    test('always has a leading and trailing slash', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setOutputPathRelativeToHost('js');

      const config = wcm.generateWebpackConfig();
      expect(config.output.publicPath).toEqual('/js/');
    });
  });

  describe('setting the output filename template', () => {
    test('has a default of [name].bundle.js', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.output.filename).toEqual('[name].bundle.js');
    });
    test('allows changing it', () => {});
  });

  describe('setting the source map type', () => {
    let nodeEnv;

    beforeEach(() => {
      nodeEnv = process.env.NODE_ENV;
    });

    test('defaults to cheap source map in development', () => {
      const wcm = new WebpackConfigMaker();
      process.env.NODE_ENV = 'development';

      const config = wcm.generateWebpackConfig();
      expect(config.devtool).toEqual('cheap-source-map');
    });
    test('defaults to source map in production', () => {
      const wcm = new WebpackConfigMaker();
      process.env.NODE_ENV = 'production';

      const config = wcm.generateWebpackConfig();
      expect(config.devtool).toEqual('source-map');
    });

    test('allows you to change the development source map type', () => {
      const wcm = new WebpackConfigMaker();
      process.env.NODE_ENV = 'development';
      wcm.setDevSourceMapType('eval');

      const config = wcm.generateWebpackConfig();
      expect(config.devtool).toEqual('eval');
    });

    test('allows you to change the production source map type', () => {
      const wcm = new WebpackConfigMaker();
      process.env.NODE_ENV = 'production';
      wcm.setProdSourceMapType('hidden-source-map');

      const config = wcm.generateWebpackConfig();
      expect(config.devtool).toEqual('hidden-source-map');
    });

    afterEach(() => {
      process.env.NODE_ENV = nodeEnv;
    });
  });

  describe('configuring loaders', () => {
    // TODO: do we want to just override the old loader here?
    test('only lets you register a loader once', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('free-loader', {});
      expect(() => {
        wcm.registerLoader('free-loader', { something: 'else' });
      }).toThrowError('A loader with that name has already been registered.');
    });

    test('remembers the config for each loader', () => {});

    test('exposes the loaders via their keys on the loaders object', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('free-loader', {});
      wcm.registerLoader('toast-loader', {});
      wcm.registerLoader('cat-loader', {});
      expect(Object.keys(wcm.loaders)).toEqual([
        'free-loader',
        'toast-loader',
        'cat-loader',
      ]);
    });

    test('allows you to update a loader’s config by merging new properties', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('party-loader', { options: { modules: true } });
      wcm.modifyLoader('party-loader', {
        options: {
          ...wcm.loaders['party-loader'].options,
          something: false,
        },
      });
      expect(wcm.loaders['party-loader']).toEqual({
        options: {
          modules: true,
          something: false,
        },
      });
    });

    test('allows you to use two versions of a loader with different config', () => {});
  });

  describe('configuring rules', () => {
    test('requires you to specify at least one extension', () => {});
    describe('uses the current source directories as the default include path', () => {
      test('works with the default source directory', () => {});
      test('works with different source directories', () => {});
    });
    test('specifying an exclude adds it to the rule', () => {});
    describe('when you specify the loaders for this rule', () => {
      test('if no loaders are specified it throws an error', () => {});
      test('if any loaders haven’t been registered it throws an error', () => {});
      test('all loaders and their options are added to the rule', () => {});
    });
  });

  describe('configuring plugins', () => {
    test('adds a plugin using its name', () => {});
    test('removes a plugin using its name', () => {});
  });
});

// webpackConfigurator.usePreset(require("elm-preset"))
//   - loads elm-loader, elm-css-modules-loader, elm-svg-loader

// culture-amp-preset
//  - elm-preset, react-preset, scss-postcss-preset
