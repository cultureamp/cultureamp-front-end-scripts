var path = require('path');
var sass = require('node-sass');
// a fork of css-modules-loader-core which can be used synchronously
var CssModulesLoaderCore = require('css-modules-loader-core2/sync');

var caStyleGuidePath = path.resolve('node_modules/cultureamp-style-guide');
var caAssetsPath = path.resolve('app/assets');
var caClientLibPath = path.resolve('lib/client/modules');

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
  // ignore stuff which isn't in module directories
  if (!/(app|lib)\/client\/modules/.test(filepath)) return '';

  // rewrite imports
  // TODO: remove the need for these murmur specific rules.
  var cleanedSrc = src
    .replace(/~cultureamp\-style\-guide/g, caStyleGuidePath)
    .replace(/~ca\-assets/g, caAssetsPath)
    .replace(/~(ca\-[^/]*)/g, caClientLibPath + '/$1');

  // process sass syntax
  var css = sass.renderSync({
    sourceComments: true,
    data: cleanedSrc,
    file: filepath,
  }).css;

  // process css modules syntax
  var result = cssModulesLoaderCore.load(css, filepath, '', pathFetcher);

  return 'module.exports = ' + JSON.stringify(result.exportTokens) + ';';
}

module.exports = preprocessStylesheet;
