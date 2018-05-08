var path = require('path');
var fs = require('fs');
var sass = require('node-sass');
// a fork of css-modules-loader-core which can be used synchronously
var CssModulesLoaderCore = require('css-modules-loader-core2/sync');

// CSS Modules Loader Core has a problem when reading a css file that has a style
// that imports an image. ie { background-image: url('test.svg') }
//
// The problem is that the postcss-modules-local-by-default module is initialized
// without the options. The quick fix is to initialize this plugin with an empty option.
var cssModulesLoaderCore = new CssModulesLoaderCore([
  CssModulesLoaderCore.localByDefault({}),
  CssModulesLoaderCore.extractImports,
  CssModulesLoaderCore.scope({
    generateScopedName: function(exportedName) {
      return exportedName;
    },
  }),
]);

function pathFetcher(filepath, relativeTo) {
  // stubbed as we don't currently need to resolve imports, just export
  // identifiers for classes defined in the current file
  return '';
}

// for jest tests we don't need the css text, but we do need to process
// stylesheets to get the css modules exported classnames.
// this is a temporary solution until we can do proper jest-webpack integration
// following this change: https://github.com/facebook/jest/pull/599
function preprocessStylesheet(src, filepath) {
  // process sass syntax
  var css = sass.renderSync({
    sourceComments: true,
    data: cleanedSrc,
    importer: (url, prev, done) => {
      if (url.charAt(0) === '~') {
        // Ideally we would use the same module folders as those configured in WebpackConfigMaker.
        // For now we will just configure it to support the default "src" folder.
        const modulePaths = [path.resolve('node_modules'), path.resolve('src')];
        const packageName = url.substr(1).split('/')[0];
        for (let modulePath of modulePaths) {
          const moduleFullPath = modulePath + '/' + packageName;
          if (fs.existsSync(moduleFullPath)) {
            const absoluteUrl = url.replace('~' + packageName, moduleFullPath);
            return { file: absoluteUrl };
          }
        }
      }
      return { file: url };
    },
    file: filepath,
  }).css;

  // process css modules syntax
  var result = cssModulesLoaderCore.load(css, filepath, '', pathFetcher);

  return 'module.exports = ' + JSON.stringify(result.exportTokens) + ';';
}

module.exports = preprocessStylesheet;
