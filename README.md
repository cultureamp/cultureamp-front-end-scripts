# cultureamp-front-end-scripts

The single dependency you need for building a Culture Amp front-end project.

#### Contributing and finding help

For Culture Amp staff:

* Ask in #front_end_practice if you need help
* Pull requests welcome. You’ll need a code-review to merge but all Culture Amp engineers have permission to approve and merge.

For everyone else

* Pull requests welcome!
* File an issue if you have trouble

**WARNING:** _While this software is open source, its primary purpose is to improve consistency, cross-team collaboration and code quality at Culture Amp. As a result, it’s likely that we will introduce more breaking API changes to this project than you’ll find in its alternatives._

## Quick Start

#### Starting from scratch:

TODO: set up `yarn create cultureamp-app`.

#### Adding to an existing repo:

Create a package.json if you don't have one already:

    yarn init

Add the scripts dependency:

    yarn add cultureamp-front-end-scripts

Add these to your package.json scripts:

    "scripts": {
        "start": "cultureamp-front-end-scripts-start",
        "build": "cultureamp-front-end-scripts-build",
        "test": "cultureamp-front-end-scripts-test",
        "lint": "cultureamp-front-end-scripts-lint",
        "flow": "cultureamp-front-end-scripts-flow",
        "format": "cultureamp-front-end-scripts-format"
    },

Then run `yarn start` and open http://localhost:8000/ to build, watch and preview your app.

## Commands

* `yarn start` - start a development server and rebuild as files change
* `yarn build` - build production assets
* `yarn test` or `yarn test --watch` - run jest tests
* `yarn lint` - run eslint to check code quality on your files
* `yarn flow` - run flow for type checking
* `yarn format` - run prettier and `eslint --fix` on all JS and CSS files

## Project structure

Our default project structure looks like this:

```
├── public
│   └── assets # Generated webpack config goes here
│   └── index.html
├── src
│   ├── main.js
│   └── main.test.js
├── package.json
└── yarn.lock
```

Things to note:

* Client-side source files and assets live inside 'src'.
* Generated assets are created in `public/assets`. These should be git-ignored.
* The development server will run from `public/`, meaning when you load http://localhost:8000/, the `index.html` is loaded by default and your assets are available at http://localhost:8000/assets/.
* None of the configuration files are in the repository by default, they mostly live in `node_modules/cultureamp-front-end-scripts/config/`.
* Your package.json should have a single `cultureamp-front-end-scripts` dependency, which in turn loads the various dependencies needed to build a standard Culture Amp front-end with React or Elm, and SASS / PostCSS etc.

## Configuration

### Webpack

By default, our webpack configuration will:

* Use `src/main.js` as an entrypoint
* Use `public/assets` as an output path
* Use `src/` as a modules folder, so you can import `src/components/dropdown.js` with `import 'components/dropdown';`
* Provide appropriate defaults for development (hot reloading etc), and production (minify, extract text etc)
* Provide loaders for:
  * Javascript (babel-loader)
  * Elm (elm-webpack-loader, elm-css-modules-loader, elm-webpack-svg-loader)
  * CSS (sass-loader, postcss-loader, css-loader (with modules), style-loader, Extract Text plugin)
  * SVG (svgo-loader, svg-sprite-loader)
* The configuration required for cultureamp-style-guide

You can provide your own Webpack configuration by supplying a file `webpack.config.js`.

Rather than creating an entire webpack configuration from scratch, we have created "WebpackConfigMaker" as an API that makes it easier to handle webpack configuration in a composable way using various presets.

```javascript
// NOTE: this is still a work-in-progress
const WebpackConfigMaker = require('cultureamp-front-end-scripts/webpack-config-maker');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var configMaker = new WebpackConfigMaker();
configMaker.usePreset('cultureamp-front-end-scripts/presets/standard');
configMaker.setEntryPoints([
  'app/client/entrypoints/admin.js',
  'app/client/entrypoints/demo.js',
  'app/client/entrypoints/exit.js',
]);
configMaker.setSourceDirectories(['app/client/', 'lib/client/']);
configMaker.addPlugin('my-html-plugin', new HtmlWebpackPlugin());

module.exports = configMaker.generateWebpackConfig();
```

TODO: provide full documentation for WebpackConfigMaker.

### Jest

By default our Jest configuration will:

* Search for test files in `src/**/*-test.js`. You can optionally keep them in a `__tests__` folder if you prefer.
* Preprocess our Babel and Sass/PostCSS files as required
* Use Enzyme, configured for React 16.
* Set `automock` to false.
* Provide some default shims. See `config/jest/utils/setupShim.js`
* Provide some custom matchers. See `config/jest/utils/customMatchers.js`
* Provide an `acceptCallsTo()` global function for working with mocked methods. See `config/jest/utils/acceptCallsTo.js`

You can provide your own Jest configuration by supplying a file `jest.config.js`:

```javascript
const baseConfig = require('cultureamp-front-end-scripts/config/jest/jest.config.js');
module.exports = {
  ...baseConfig,
  automock: true,
};
```

### ESLint

By default our ESLint configuration will provide a collection of rules curated to Culture Amp's needs.
It was originally based on the AirBNB style guide, and expects prettier to provide code formatting.

You can provide your own ESLint configuration by supplying a file `eslint.config.js`:

```javascript
const baseConfig = require('cultureamp-front-end-scripts/config/eslint/eslint.config.js');
const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    'prefer-const': OFF,
  },
};
```

### Flow

By default our Flow configuration will:

* Check files in `src/`
* Ignore files in `node_modules`. You can use `flow-typed` to correctly type 3rd party libraries.
* Provide stubs for assets and CSS modules imported via Webpack.

The flow configuration lives in `.flowconfig`, and is copied into your directory the first time you run `yarn flow`.
You can edit the flow configuration by editing this file.

### Prettier

We currently don't offer any default prettier configuration, preferring to stick to the defaults.

If you wish to change the settings you can provide your own [configuration file](https://prettier.io/docs/en/configuration.html).
