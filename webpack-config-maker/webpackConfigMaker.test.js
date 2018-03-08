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
      expect(wcm.loaders['carb-loader']).toEqual({
        loader: 'carb-loader',
        options: {
          modules: false,
        },
      });
    });

    test('exposes the loaders via their keys on the loaders object', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('free-loader', {});
      wcm.registerLoader('front-loader', {});
      wcm.registerLoader('down-loader', {});
      expect(Object.keys(wcm.loaders)).toEqual(
        expect.arrayContaining(['free-loader', 'front-loader', 'down-loader'])
      );
    });

    test('registering a loader without a `loader` property uses a loader by the same name', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('sass-loader', {
        options: {
          precision: 9,
        },
      });
      expect(wcm.loaders['sass-loader']).toEqual({
        loader: 'sass-loader',
        options: {
          precision: 9,
        },
      });
    });

    test('registering a loader with no options uses a loader by the same name', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('css-loader');
      expect(wcm.loaders['css-loader']).toEqual({
        loader: 'css-loader',
      });
    });

    test('allows you to update a loader’s config by merging new properties', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('up-loader', { options: { modules: true } });
      wcm.modifyLoader('up-loader', {
        options: {
          something: false,
        },
      });
      expect(wcm.loaders['up-loader']).toEqual({
        loader: 'up-loader',
        options: {
          modules: true,
          something: false,
        },
      });
    });

    test('will overwrite values when updating loader config (rather than merging them)', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('up-loader', {
        options: { modules: true, presets: ['preset-es6'] },
      });
      wcm.modifyLoader('up-loader', {
        options: {
          presets: ['preset-react'],
        },
      });
      expect(wcm.loaders['up-loader']).toEqual({
        loader: 'up-loader',
        options: {
          modules: true,
          presets: ['preset-react'],
        },
      });
    });

    test('allows you to use two versions of a loader with different config', () => {
      const wcm = new WebpackConfigMaker();
      wcm.registerLoader('top-loader-with-modules', {
        loader: 'top-loader',
        options: { modules: true },
      });
      wcm.registerLoader('top-loader-without-modules', {
        loader: 'top-loader',
        options: { modules: false },
      });

      expect(wcm.loaders['top-loader-with-modules']).toEqual({
        loader: 'top-loader',
        options: { modules: true },
      });
      expect(wcm.loaders['top-loader-without-modules']).toEqual({
        loader: 'top-loader',
        options: { modules: false },
      });
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
        wcm.registerLoader('top-loader');
        wcm.addRule({
          extension: 'scss',
          loaders: ['top-loader'],
        });
        const config = wcm.generateWebpackConfig();

        expect(config.module.rules).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              include: ['src'],
            }),
          ])
        );
      });

      test('works with different source directories', () => {
        const wcm = new WebpackConfigMaker();
        wcm.setSourceDirectories(['src/components', 'src/stuff']);
        wcm.registerLoader('top-loader');
        wcm.addRule({
          extension: 'scss',
          loaders: ['top-loader'],
        });

        const config = wcm.generateWebpackConfig();
        expect(config.module.rules).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              include: ['src/components', 'src/stuff'],
            }),
          ])
        );
      });
    });

    describe('specifying an exclude adds it to the rule', () => {
      test('works with a string', () => {
        const wcm = new WebpackConfigMaker();
        wcm.registerLoader('top-loader');
        wcm.addRule({
          extension: 'scss',
          exclude: 'src/assets',
          loaders: ['top-loader'],
        });

        expect(wcm.rules).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              exclude: ['src/assets'],
            }),
          ])
        );
      });

      test('works with an array', () => {
        const wcm = new WebpackConfigMaker();
        wcm.registerLoader('top-loader');
        wcm.addRule({
          extension: 'scss',
          exclude: ['src/assets', 'src/utils'],
          loaders: ['top-loader'],
        });

        expect(wcm.rules).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              exclude: ['src/assets', 'src/utils'],
            }),
          ])
        );
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

      describe('if any loaders haven’t been registered it throws an error', () => {
        test('with a single loader', () => {
          const wcm = new WebpackConfigMaker();

          expect(() => {
            wcm.addRule({
              extension: 'scss',
              loader: 'carb-loader',
            });
          }).toThrowError(
            'The following loaders have not been registered: carb-loader'
          );
        });

        test('with multiple loaders', () => {
          const wcm = new WebpackConfigMaker();
          wcm.registerLoader('front-loader');

          expect(() => {
            wcm.addRule({
              extension: 'scss',
              loaders: ['carb-loader', 'front-loader', 'free-loader'],
            });
          }).toThrowError(
            'The following loaders have not been registered: carb-loader, free-loader'
          );
        });
      });

      describe('when multiple loaders and rules are set', () => {
        const wcm = new WebpackConfigMaker();
        wcm.registerLoader('css-loader');
        wcm.registerLoader('sass-loader');
        wcm.registerLoader('my-babel-loader', {
          loader: 'babel-loader',
          options: {
            presets: ['preset-es6', 'preset-react'],
          },
        });
        wcm.addRule({
          extension: 'scss',
          loaders: ['css-loader', 'sass-loader'],
          include: 'src/styles',
        });
        wcm.addRule({
          extensions: ['js', 'jsx'],
          loader: 'my-babel-loader',
          exclude: 'src/vendor',
        });
        const config = wcm.generateWebpackConfig();
        const rules = config.module.rules;
        const cssRule = rules[0];
        const jsRule = rules[1];

        test('the regexes are output correctly', () => {
          expect(jsRule).toEqual(
            expect.objectContaining({
              test: /\.(js|jsx)$/,
            })
          );
          expect(cssRule).toEqual(
            expect.objectContaining({
              test: /\.(scss)$/,
            })
          );
        });

        test('the includes are output correctly', () => {
          expect(cssRule.include).toEqual(['src/styles']);
          expect(jsRule.include).toEqual(['src']);
        });

        test('the excludes are output correctly', () => {
          expect(cssRule.exclude).toBe(undefined);
          expect(jsRule.exclude).toEqual(['src/vendor']);
        });

        test('the loader config is output correctly', () => {
          expect(cssRule.use[0].loader).toBe('css-loader');
          expect(cssRule.use[1].loader).toBe('sass-loader');
          expect(jsRule.use[0].loader).toBe('babel-loader');
          expect(jsRule.use[0].options.presets).toEqual([
            'preset-es6',
            'preset-react',
          ]);
        });
      });
    });
  });

  describe('configuring plugins', () => {
    test('adds a plugin using its name', () => {
      const wcm = new WebpackConfigMaker();
      const uglifyPlugin = {};
      const extractTextPlugin = {};
      wcm.addPlugin('Uglify', uglifyPlugin);
      wcm.addPlugin('ExtractText', extractTextPlugin);
      expect(Object.keys(wcm.plugins)).toEqual(['Uglify', 'ExtractText']);
      expect(wcm.plugins['Uglify']).toBe(uglifyPlugin);
      expect(wcm.plugins['ExtractText']).toBe(extractTextPlugin);
    });

    test('can replace a plugin by redefining it', () => {
      const wcm = new WebpackConfigMaker();
      const uglifyPlugin = {};
      const uglifyPlugin2 = {};
      wcm.addPlugin('Uglify', uglifyPlugin);
      wcm.addPlugin('Uglify', uglifyPlugin2);
      expect(Object.keys(wcm.plugins)).toEqual(['Uglify']);
      expect(wcm.plugins['Uglify']).toBe(uglifyPlugin2);
    });

    test('removes a plugin using its name', () => {
      const wcm = new WebpackConfigMaker();
      const uglifyPlugin = {};
      const extractTextPlugin = {};
      wcm.addPlugin('Uglify', uglifyPlugin);
      wcm.addPlugin('ExtractText', extractTextPlugin);
      wcm.removePlugin('Uglify');
      expect(Object.keys(wcm.plugins)).toEqual(['ExtractText']);
      expect(wcm.plugins['ExtractText']).toBe(extractTextPlugin);
    });

    test('outputs a plugins array on the final config', () => {
      const wcm = new WebpackConfigMaker();
      const uglifyPlugin = {};
      const extractTextPlugin = {};
      wcm.addPlugin('Uglify', uglifyPlugin);
      wcm.addPlugin('ExtractText', extractTextPlugin);
      const config = wcm.generateWebpackConfig();
      expect(config.plugins).toEqual([uglifyPlugin, extractTextPlugin]);
    });
  });

  describe('making a rule use the extractTextPlugin', () => {
    /*
    Use case:
    ExtractText plugin needs to work like this:
    - You create a `new ExtractTextPlugin()`
    - Add it to `plugins` array
    - For the scss rule, if the loaders looked like:
       - use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    - We replace it with:
       - use: [{
         loader: extractTextPlugin.extract({
           fallback: {loader: 'style-loader', options: ...},
           use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
         }),
       }]

    HappyPack is similar...
    */
    test('');
  });

  describe('configuring decorators', () => {
    test('I can add a decorator with a name', () => {
      const wcm = new WebpackConfigMaker();
      wcm.addDecorator('style-guide-decorator', config => {});
      wcm.addDecorator('happy-pack-decorator', config => {});
      expect(Object.keys(wcm.decorators)).toEqual([
        'style-guide-decorator',
        'happy-pack-decorator',
      ]);
    });

    test('I can remove a decorator with a name', () => {
      const wcm = new WebpackConfigMaker();
      wcm.addDecorator('style-guide-decorator', config => {});
      wcm.addDecorator('happy-pack-decorator', config => {});
      wcm.removeDecorator('style-guide-decorator');
      expect(Object.keys(wcm.decorators)).toEqual(['happy-pack-decorator']);
    });

    test('Decorators run on the final config before being exported', () => {
      const wcm = new WebpackConfigMaker();
      wcm.addDecorator('set-parallelism', config => {
        return {
          ...config,
          paralellism: 0,
        };
      });
      wcm.addDecorator('increase-parallelism', config => {
        config.paralellism++;
        return config;
      });
      const config = wcm.generateWebpackConfig();
      expect(config.paralellism).toBe(1);
    });
  });
});

// webpackConfigurator.usePreset(require("elm-preset"))
//   - loads elm-loader, elm-css-modules-loader, elm-svg-loader

// culture-amp-preset
//  - elm-preset, react-preset, scss-postcss-preset
