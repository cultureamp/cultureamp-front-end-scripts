describe('our webpack config thing', () => {
  describe('the default configuration', () => {
    it('with no configuration, should return a basic webpack config', () => {});
    // dev server
    // minification
    // entry filenames
    // output targets
    // stats
    // sourcemaps
  });

  describe('basic settings', () => {
    it('should let you set an entrypoint', () => {});
    it('should let you add multiple entry points', () => {});
    it('should let you set the output folder', () => {});
    it('should let you set the output public path', () => {});
    it('should let you set the output filename template', () => {});
    it('should let you add a resolve modules folder', () => {});
    it('should let you remove a resolve modules folder', () => {});
    it('should let you set the source map stragegy', () => {});
  });

  describe('configuring loaders', () => {
    it('should be able to add a loader with some config', () => {});
    it('should be able to update the config of a loader with the same name', () => {});
    it('should be able to remove a loader using its name', () => {});
    // TODO: figure out if we need to be able to configure on a per-directory basis,
    // for example to apply cssModuleLoader only to certain folders like in murmur.
  });

  describe('configuring plugins', () => {
    it('should be able to add a plugin using its name', () => {});
    it('should be able to remove a plugin using its name', () => {});
  });
});

// webpackConfigurator.usePreset(require("elm-preset"))
//   - loads elm-loader, elm-css-modules-loader, elm-svg-loader

// culture-amp-preset
//  - elm-preset, react-preset, scss-postcss-preset
