const WebpackConfigMaker = require('./WebpackConfigMaker');

describe('our webpack config thing', () => {
  describe('allows you to set an entry point', () => {
    test('has a default of src/main.js', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.entry).toEqual(['src/main.js']);
    });

    test('allows you to set a single entry point', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setEntryPoint('src/app/app.js');

      const config = wcm.generateWebpackConfig();
      expect(config.entry).toEqual(['src/app/app.js']);
    });

    test('allows you to set multiple entry points', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setEntryPoints(['src/app/app.js', 'src/main.js']);

      const config = wcm.generateWebpackConfig();
      expect(config.entry).toEqual(['src/app/app.js', 'src/main.js']);
    });
  });

  describe('allows you to set source directories', () => {
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

    test('allows you to set a single src dir', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setSourceDirectory('app/client/modules');

      const config = wcm.generateWebpackConfig();
      expect(config.resolve.modules).toEqual([
        'node_modules',
        'app/client/modules',
      ]);
    });
  });

  describe('allows you to set the output path', () => {
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

  describe('allows you to set the output public path', () => {
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

  describe('allows you to set the output filename template', () => {
    test('has a default of [name].bundle.js', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.output.filename).toEqual('[name].bundle.js');
    });
    test('allows changing it', () => {});
  });

  describe('allows you to set the source map type', () => {
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

    test('remembers the config for each loader', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('carb-loader', {
        options: {
          modules: false,
        },
      });
      wcm.registerLoader('spring-loader', {
        foo: {
          bar: 'baz',
        },
      });

      expect(wcm.loaders['carb-loader']).toEqual({
        options: {
          modules: false,
        },
      });
      expect(wcm.loaders['spring-loader']).toEqual({
        foo: {
          bar: 'baz',
        },
      });
    });

    test('exposes the loaders via their keys on the loaders object', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('free-loader', {});
      wcm.registerLoader('front-loader', {});
      wcm.registerLoader('down-loader', {});
      expect(Object.keys(wcm.loaders)).toEqual([
        'free-loader',
        'front-loader',
        'down-loader',
      ]);
    });

    test('allows you to update a loader’s config by merging new properties', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('up-loader', { options: { modules: true } });
      wcm.modifyLoader('up-loader', {
        options: {
          ...wcm.loaders['up-loader'].options,
          something: false,
        },
      });
      expect(wcm.loaders['up-loader']).toEqual({
        options: {
          modules: true,
          something: false,
        },
      });
    });

    test('allows you to use two versions of a loader with different config', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('top-loader-with-modules', {
        options: { modules: true },
      });
      wcm.registerLoader('top-loader-without-modules', {
        options: { modules: false },
      });

      expect(wcm.loaders['top-loader-with-modules'].options.modules).toEqual(
        true
      );
      expect(wcm.loaders['top-loader-without-modules'].options.modules).toEqual(
        false
      );
    });
  });

  /*
   * rule: {
   *   extensions: [],
   *   include: [],  // current source directories as default
   *   exclude: [],
   *   loaders: [],
   * }
   *
   */
  describe('configuring rules', () => {
    test('requires you to specify at least one extension', () => {
      const wcm = new WebpackConfigMaker();

      expect(() => {
        wcm.addRule({
          include: 'components/ui',
          loaders: ['top-loader'],
        });
      }).toThrowError(
        'You must specify at least one file extension to create a rule.'
      );
      expect(() => {
        wcm.addRule({
          extensions: [],
          loaders: ['top-loader'],
        });
      }).toThrowError(
        'You must specify at least one file extension to create a rule.'
      );
    });

    describe('uses the current source directories as the default include path', () => {
      test('works with the default source directory', () => {
        const wcm = new WebpackConfigMaker();
        wcm.addRule({
          extension: 'scss',
          loaders: ['top-loader'],
        });

        // TODO: this feels a bit yuck checking the first element
        // directly. Is there a preferred way?
        expect(wcm.rules[0].include).toEqual(['src']);
      });

      test('works with different source directories', () => {
        const wcm = new WebpackConfigMaker();
        wcm.setSourceDirectories(['src/components', 'src/stuff']);
        wcm.addRule({
          extension: 'scss',
          loaders: ['top-loader'],
        });

        expect(wcm.rules[0].include).toEqual(['src/components', 'src/stuff']);
      });
    });

    describe('specifying an exclude adds it to the rule', () => {
      test('works with a string', () => {
        const wcm = new WebpackConfigMaker();
        wcm.addRule({
          extension: 'scss',
          exclude: 'src/assets',
          loaders: ['top-loader'],
        });

        expect(wcm.rules[0].exclude).toEqual(['src/assets']);
      });
      test('works with an array', () => {
        const wcm = new WebpackConfigMaker();
        wcm.addRule({
          extension: 'scss',
          exclude: ['src/assets', 'src/utils'],
          loaders: ['top-loader'],
        });

        expect(wcm.rules[0].exclude).toEqual(['src/assets', 'src/utils']);
      });
    });

    describe('when you specify the loaders for this rule', () => {
      test('if no loaders are specified it throws an error', () => {
        const wcm = new WebpackConfigMaker();

        expect(() => {
          wcm.addRule({
            extension: 'scss',
          });
        }).toThrowError(
          'You must specify at least one loader to create a rule.'
        );
      });

      // TODO
      test('if any loaders haven’t been registered it throws an error', () => {
        const wcm = new WebpackConfigMaker();

        expect(() => {
          wcm.addRule({
            extension: 'scss',
            loaders: ['carb-loader'],
          });
        }).toThrowError(
          'The following loaders have not been registered: carb-loader'
        );
      });

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
