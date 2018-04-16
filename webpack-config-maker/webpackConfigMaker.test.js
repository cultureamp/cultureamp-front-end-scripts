const WebpackConfigMaker = require('./webpackConfigMaker');

let pwd;

beforeEach(() => {
  pwd = process.env.PWD;
  process.env.PWD = '/user/workspace';
});

afterEach(() => {
  process.env.PWD = pwd;
});

describe('our webpack config thing', () => {
  describe('allows you to set an entry point', () => {
    test('has a default of main.js', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.entry).toEqual(['main.js']);
    });

    test('allows you to set a single entry point', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setEntryPoint('app/app.js');

      const config = wcm.generateWebpackConfig();
      expect(config.entry).toEqual(['app/app.js']);
    });

    test('allows you to set multiple entry points', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setEntryPoints(['app/app.js', 'main.js']);

      const config = wcm.generateWebpackConfig();
      expect(config.entry).toEqual(['app/app.js', 'main.js']);
    });
  });

  describe('allows you to set source directories', () => {
    test('has a default of src', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.resolve.modules).toEqual([
        '/user/workspace/node_modules',
        '/user/workspace/src',
      ]);
    });

    test('allows changing the src dir', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setSourceDirectories(['app/client/modules', 'lib/client/modules']);

      const config = wcm.generateWebpackConfig();
      expect(config.resolve.modules).toEqual([
        '/user/workspace/node_modules',
        '/user/workspace/app/client/modules',
        '/user/workspace/lib/client/modules',
      ]);
    });

    test('allows you to set a single src dir', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setSourceDirectory('app/client/modules');

      const config = wcm.generateWebpackConfig();
      expect(config.resolve.modules).toEqual([
        '/user/workspace/node_modules',
        '/user/workspace/app/client/modules',
      ]);
    });
  });

  describe('allows you to set the web root path', () => {
    test('has a default of public/', () => {
      const wcm = new WebpackConfigMaker();
      const config = wcm.generateWebpackConfig();
      expect(config.output.path).toEqual('/user/workspace/public/assets/');
    });

    test('allows changing the web root', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setWebRoot('www');

      const config = wcm.generateWebpackConfig();
      expect(config.output.path).toEqual('/user/workspace/www/assets/');
    });
  });

  describe('allows you to set the asset folder relative to the webroot', () => {
    test('has a default of /assets', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.output.publicPath).toEqual('/assets/');
      expect(config.output.path).toEqual('/user/workspace/public/assets/');
    });

    test('allows changing the asset path', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setAssetPathRelativeToWebRoot('/js/');

      const config = wcm.generateWebpackConfig();
      expect(config.output.path).toEqual('/user/workspace/public/js/');
      expect(config.output.publicPath).toEqual('/js/');
    });

    test('always has a leading and trailing slash', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setAssetPathRelativeToWebRoot('js');

      const config = wcm.generateWebpackConfig();
      expect(config.output.path).toEqual('/user/workspace/public/js/');
      expect(config.output.publicPath).toEqual('/js/');
    });
  });

  describe('allows you to set the output filename template', () => {
    test('has a default of [name].bundle.js', () => {
      const wcm = new WebpackConfigMaker();

      const config = wcm.generateWebpackConfig();
      expect(config.output.filename).toEqual('[name].bundle.js');
    });

    test('allows changing it', () => {
      const wcm = new WebpackConfigMaker();
      wcm.setFilenameTemplate('[name].dist.js');
      const config = wcm.generateWebpackConfig();
      expect(config.output.filename).toEqual('[name].dist.js');
    });
  });

  describe('allows you to set a library type to target', () => {
    test('does not produce a library bundle by default', () => {
      const wcm = new WebpackConfigMaker();
      const config = wcm.generateWebpackConfig();
      expect(config.output.library).toBeUndefined();
      expect(config.output.libraryTarget).toBeUndefined();
    });

    // test('allows changing it', () => {
    //   const wcm = new WebpackConfigMaker();
    //   const config = wcm.generateWebpackConfig();
    //   expect(config.output.library).toBeUndefined();
    //   expect(config.output.libraryTarget).toBeUndefined();
    // });
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

  describe('configuring rules', () => {
    test('requires you to specify at least one extension', () => {
      const wcm = new WebpackConfigMaker();

      expect(() => {
        wcm.registerLoader('top-loader');
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
              include: ['/user/workspace/src'],
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
              include: [
                '/user/workspace/src/components',
                '/user/workspace/src/stuff',
              ],
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
              exclude: ['/user/workspace/src/assets'],
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
              exclude: [
                '/user/workspace/src/assets',
                '/user/workspace/src/utils',
              ],
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

      test('the loaders and rules generate valid config', () => {
        const wcm = new WebpackConfigMaker();
        wcm.registerLoader('my-babel-loader', {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-es6', 'babel-preset-react'],
          },
        });
        wcm.addRule({
          extension: 'js',
          loaders: ['my-babel-loader'],
        });
        const config = wcm.generateWebpackConfig();
        const rule = config.module.rules[0];
        expect(rule).toEqual(
          expect.objectContaining({
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['babel-preset-es6', 'babel-preset-react'],
                },
              },
            ],
          })
        );
      });

      test('that useFirstMatchingLoader generates a oneOf rule()', () => {
        const wcm = new WebpackConfigMaker();
        wcm.registerLoader('url-loader', {});
        wcm.registerLoader('file-loader', {});
        wcm.addRule({
          extensions: ['png', 'jpg', 'gif', 'svg'],
          loaders: ['url-loader', 'file-loader'],
          useFirstMatchingLoader: true,
        });
        const config = wcm.generateWebpackConfig();
        const rule = config.module.rules[0];
        expect(rule).toEqual(
          expect.objectContaining({
            oneOf: [{ loader: 'url-loader' }, { loader: 'file-loader' }],
          })
        );
      });

      describe('when multiple loaders and rules are set', () => {
        let cssRule, jsRule;

        beforeEach(() => {
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
          cssRule = rules[0];
          jsRule = rules[1];
        });

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
          expect(cssRule.include).toEqual(['/user/workspace/src/styles']);
          expect(jsRule.include).toEqual(['/user/workspace/src']);
        });

        test('the excludes are output correctly', () => {
          expect(cssRule.exclude).toBe(undefined);
          expect(jsRule.exclude).toEqual(['/user/workspace/src/vendor']);
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
    let wcm, originalNodeEnv;

    beforeEach(() => {
      originalNodeEnv = process.env.NODE_ENV;
      wcm = new WebpackConfigMaker();
      wcm.registerLoader('style-loader', { loader: 'style-loader' });
      wcm.registerLoader('css-loader', { loader: 'css-loader' });
      wcm.registerLoader('postcss-loader', { loader: 'postcss-loader' });
      wcm.registerLoader('sass-loader', { loader: 'sass-loader' });
      wcm.addRule({
        extension: 'scss',
        loaders: ['css-loader', 'postcss-loader', 'sass-loader'],
        include: 'src/styles',
        extractText: true,
      });
    });

    test('It should add style-loader', () => {
      const rule = wcm.generateWebpackConfig().module.rules[0];
      expect(rule.use.length).toEqual(4);
      expect(rule.use[0].loader).toEqual('style-loader');
      expect(rule.use[1].loader).toEqual('css-loader');
      expect(rule.use[2].loader).toEqual('postcss-loader');
      expect(rule.use[3].loader).toEqual('sass-loader');
    });

    test('In development it should be disabled', () => {
      process.env.NODE_ENV = 'development';
      const rule = wcm.generateWebpackConfig().module.rules[0];
      // Note, ExtractTextPlugin doesn't work with Webpack 4, so this rule is a placeholder for now.
    });

    test('In production it should be enabled', () => {
      process.env.NODE_ENV = 'production';
      const rule = wcm.generateWebpackConfig().module.rules[0];
      // Note, ExtractTextPlugin doesn't work with Webpack 4, so this rule is a placeholder for now.
    });

    afterAll(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });
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

  describe('Using presets', () => {
    test('A preset function runs immediately', () => {
      const wcm = new WebpackConfigMaker();
      wcm.usePreset(configMaker => {
        configMaker.setEntryPoint('src/app.js');
      });
      expect(wcm.entryPoints).toEqual(['src/app.js']);
    });

    test('If a string is provided, it will be treated as a path to import the preset function', () => {
      const wcm = new WebpackConfigMaker();
      wcm.usePreset('./__fixtures__/examplePreset.js');
      expect(wcm.sourceDirectories).toEqual([
        '/user/workspace/app/client/modules',
        '/user/workspace/lib/client/modules',
      ]);
    });

    test('If you provide a string and that is not a valid path, an error is thrown', () => {
      const wcm = new WebpackConfigMaker();
      expect(() => {
        wcm.usePreset('./__fixtures__/unknown.js');
      }).toThrowError('Cannot load preset ./__fixtures__/unknown.js');
    });

    test('You can use multiple presets with usePresets()', () => {
      const wcm = new WebpackConfigMaker();
      wcm.usePreset(configMaker => {
        configMaker.setWebRoot('bin');
      });
      wcm.usePresets([
        configMaker => {
          configMaker.setEntryPoint('src/app.js');
        },
        './__fixtures__/examplePreset.js',
      ]);
      expect(wcm.webRootPath).toEqual('/user/workspace/bin');
      expect(wcm.entryPoints).toEqual(['src/app.js']);
      expect(wcm.sourceDirectories).toEqual([
        '/user/workspace/app/client/modules',
        '/user/workspace/lib/client/modules',
      ]);
    });
  });

  describe('environment specific helpers', () => {
    let nodeEnv, mainFile;

    beforeEach(() => {
      nodeEnv = process.env.NODE_ENV;
      mainFile = require.main.filename;
    });

    afterEach(() => {
      process.env.NODE_ENV = nodeEnv;
      require.main.filename = nodeEnv;
    });

    test('development mode correctly sets isDevelopmentEnabeld() and isProductionEnabled()', () => {
      process.env.NODE_ENV = 'development';
      const wcm = new WebpackConfigMaker();
      expect(wcm.isDevelopmentMode()).toBeTruthy();
      expect(wcm.isProductionMode()).toBeFalsy();
    });

    test('production mode correctly sets isDevelopmentEnabeld() and isProductionEnabled()', () => {
      process.env.NODE_ENV = 'production';
      const wcm = new WebpackConfigMaker();
      expect(wcm.isDevelopmentMode()).toBeFalsy();
      expect(wcm.isProductionMode()).toBeTruthy();
    });

    test('isCachingEnabled() is false by default', () => {
      const wcm = new WebpackConfigMaker();
      expect(wcm.isCachingEnabled()).toBeFalsy();
    });

    test('isHotModuleReplacementEnabled() is false by default', () => {
      const wcm = new WebpackConfigMaker();
      expect(wcm.isHotModuleReplacementEnabled()).toBeFalsy();
    });

    test('getProjectDirectory() returns the current PWD', () => {
      const wcm = new WebpackConfigMaker();
      expect(wcm.getProjectDirectory()).toBe('/user/workspace');
    });

    test('getCacheDirectory() returns $PWD/tmp/cache by default', () => {
      const wcm = new WebpackConfigMaker();
      expect(wcm.getCacheDirectory()).toBe('/user/workspace/tmp/cache');
    });

    test('isDevServer() is true when using webpack-dev-server', () => {
      require.main.filename =
        '/user/workspace/node_modules/.bin/webpack-dev-server.js';
      const wcm = new WebpackConfigMaker();
      expect(wcm.isDevServer()).toBeTruthy();
    });

    test('isDevServer() is false when using normal webpack', () => {
      require.main.filename = '/user/workspace/node_modules/.bin/webpack.js';
      const wcm = new WebpackConfigMaker();
      expect(wcm.isDevServer()).toBeFalsy();
    });
  });
});
