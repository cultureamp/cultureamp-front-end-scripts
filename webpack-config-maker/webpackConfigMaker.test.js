describe('our webpack config thing', () => {
  describe('setting an entrypoint', () => {
    test('has a default of src/main.js', () => {});
    test('allows setting a single entry point', () => {});
    test('allows setting multiple entry points', () => {});
  });

  describe('setting source directories', () => {
    test('has a default of src', () => {});
    test('allows changing the src dir', () => {});
    test('has node_modules as a modules folder', () => {});
  });

  describe('setting the output dir', () => {
    test('has a default of public/assets', () => {});
    test('allows changing the output dir', () => {});
    test('treats relative paths as relative to the project root', () => {});
  });

  describe('setting the output public path', () => {
    test('has a default of /assets', () => {});
    test('allows changing the public path', () => {});
    test('always has a leading and trailing slash', () => {});
  });

  describe('setting the output filename template', () => {
    test('has a default of [name].bundle.js', () => {});
    test('allows changing it', () => {});
  });

  describe('setting the source map type', () => {
    test('defaults to cheap source map in development', () => {});
    test('defaults to source map in production', () => {});
    test('allows you to change it', () => {});
  });

  describe('configuring loaders', () => {
    test('only lets you register a loader once', () => {});
    test('remembers the config for each loader', () => {});
    test('exposes the loaders via their keys on the loaders object', () => {});
    test('allows you to update a loader’s config by merging new properties', () => {});
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
