// Ignore all files within node_modules & vendor
function shouldBabelPreprocess(filename) {
  return !filename.startsWith('vendor/') && /\.js$/.test(filename);
}

module.exports = shouldBabelPreprocess;
