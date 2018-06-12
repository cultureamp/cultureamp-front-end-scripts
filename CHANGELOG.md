# Release History: cultureamp-style-front-end-scripts

## 0.3.0

- ✨ Add optional `hash: string` argument to WebpackConfigMaker.getFilenameTemplate(), allowing you to use a custom hash like `[chunkhash]` or `[contenthash]` instead.
- 🐛 Fix bugs with static assets preset:
  - file-loader and url-loader were not included as dependencies
  - file-loader now uses `[hash]` instead of `[contenthash]` (which was not supported) in the output filename.
- 👍 Upgrade to flow 0.73

## 0.2.4

- 🐛 Fix path issue with ESLint configuration in Visual Studio Code.

## 0.2.3

- 👍 Enable ESLint configuration to run in Visual Studio Code (NodeJS 7.x).

## 0.2.2

- 👍 Enable [historyApiFallback](https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback) for webpack dev server to enable client-side routing, where the server serves index.html for all URLs.

## 0.2.1

- 👍 Use [html-webpack-harddisk-plugin](https://github.com/jantimon/html-webpack-harddisk-plugin) to ensure the webpack dev server always updates index.html on disk, and update the README to suggest using a symlink as the easiest path to serving an index.html.

## 0.2.0

- ✨ MiniCSSExtractPlugin is now used to extract stylesheets.
- ✨ UglifyJS and OptimizeCssAssetsWebpackPlugin now run by default on production builds.
- ✨ Generate an index.html automatically
- 👍 Ensure scripts run with appropriate `NODE_ENV` environment variable.
- 🐛 Improved handling of Sass imports in Jest tests.
- 💔 Replaced `setFilenameTemplate` with `setDevFilenameTemplate()` and `setProdFilenameTemplate()`
  - By default production builds will include a hash in the generated files.
  - These templates will now be used for JS, CSS and file assets, so they should include an `[EXT]` variable.

## 0.1.0

- ✨ First working release
- ✨ Scripts for build, start, test, lint, flow, format
- ✨ Out-of-the-box config for Webpack, Babel, Jest, ESLint, Flow, Prettier
- ✨ WebpackConfigMaker for configuring webpack builds in a more declarative manner
