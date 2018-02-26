const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: '[name].bundle.js',
    path: path.join(process.env.PWD, 'public/assets'),
    publicPath: '/assets/',
    sourceMapFilename: '[file].map',
  },
  devServer: {
    contentBase: './public',
    overlay: {
      warnings: true,
      errors: true,
    },
    port: 8082,
    disableHostCheck: true,
    hot: false,
  },
};
