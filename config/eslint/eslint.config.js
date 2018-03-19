const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: ['eslint:recommended', 'plugin:import/errors'],
  settings: {
    'import/resolver': {
      webpack: {
        config:
          process.env.PWD +
          '/node_modules/cultureamp-front-end-scripts/config/webpack/webpack.config.js',
      },
    },
    'import/ignore': [
      'node_modules',
      '\\.elm',
      '\\.(scss|css)$',
      '\\.(png|gif|jpg|svg)$',
    ],
    react: {
      version: '16.2',
    },
  },
  parser: 'babel-eslint',
  plugins: ['prettier', 'react', 'flowtype'],
  env: {
    es6: true,
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    /**
     * Strict mode
     */
    // babel inserts "use strict"; for us
    strict: [ERROR, 'never'], // http://eslint.org/docs/rules/strict

    /**
     * ES6
     */
    'no-var': ERROR, // http://eslint.org/docs/rules/no-var
    'prefer-const': ERROR, // http://eslint.org/docs/rules/prefer-const

    /**
     * Variables
     */
    'no-shadow': ERROR, // http://eslint.org/docs/rules/no-shadow
    'no-shadow-restricted-names': ERROR, // http://eslint.org/docs/rules/no-shadow-restricted-names
    'no-unused-vars': [
      ERROR,
      {
        // http://eslint.org/docs/rules/no-unused-vars
        vars: 'local',
        args: 'after-used',
      },
    ],
    'no-use-before-define': [ERROR, 'nofunc'], // http://eslint.org/docs/rules/no-use-before-define

    /**
     * Possible errors
     */
    'comma-dangle': [ERROR, 'always-multiline'], // http://eslint.org/docs/rules/comma-dangle
    'no-cond-assign': [ERROR, 'always'], // http://eslint.org/docs/rules/no-cond-assign
    'no-console': ERROR, // http://eslint.org/docs/rules/no-console
    'no-debugger': WARN, // http://eslint.org/docs/rules/no-debugger
    // TODO: Find a better way to do alert
    'no-alert': OFF, // http://eslint.org/docs/rules/no-alert
    'no-constant-condition': WARN, // http://eslint.org/docs/rules/no-constant-condition
    'no-dupe-keys': ERROR, // http://eslint.org/docs/rules/no-dupe-keys
    'no-duplicate-case': ERROR, // http://eslint.org/docs/rules/no-duplicate-case
    'no-empty': ERROR, // http://eslint.org/docs/rules/no-empty
    'no-ex-assign': ERROR, // http://eslint.org/docs/rules/no-ex-assign
    'no-extra-boolean-cast': OFF, // http://eslint.org/docs/rules/no-extra-boolean-cast
    'no-extra-semi': ERROR, // http://eslint.org/docs/rules/no-extra-semi
    'no-func-assign': ERROR, // http://eslint.org/docs/rules/no-func-assign
    'no-inner-declarations': ERROR, // http://eslint.org/docs/rules/no-inner-declarations
    'no-invalid-regexp': ERROR, // http://eslint.org/docs/rules/no-invalid-regexp
    'no-irregular-whitespace': ERROR, // http://eslint.org/docs/rules/no-irregular-whitespace
    'no-obj-calls': ERROR, // http://eslint.org/docs/rules/no-obj-calls
    'quote-props': [ERROR, 'as-needed', { unnecessary: false }], // http://eslint.org/docs/rules/quote-props
    'no-sparse-arrays': ERROR, // http://eslint.org/docs/rules/no-sparse-arrays
    'no-unexpected-multiline': OFF, // http://eslint.org/docs/rules/no-unexpected-multiline
    'no-unreachable': ERROR, // http://eslint.org/docs/rules/no-unreachable
    'use-isnan': ERROR, // http://eslint.org/docs/rules/use-isnan
    'block-scoped-var': ERROR, // http://eslint.org/docs/rules/block-scoped-var

    /**
     * Best practices
     */
    'consistent-return': OFF, // http://eslint.org/docs/rules/consistent-return
    'default-case': ERROR, // http://eslint.org/docs/rules/default-case
    'dot-notation': [
      ERROR,
      {
        // http://eslint.org/docs/rules/dot-notation
        allowKeywords: true,
      },
    ],
    eqeqeq: [ERROR, 'smart'], // http://eslint.org/docs/rules/eqeqeq
    'guard-for-in': ERROR, // http://eslint.org/docs/rules/guard-for-in
    'no-caller': ERROR, // http://eslint.org/docs/rules/no-caller
    'no-else-return': ERROR, // http://eslint.org/docs/rules/no-else-return
    'no-eq-null': OFF, // http://eslint.org/docs/rules/no-eq-null
    'no-eval': ERROR, // http://eslint.org/docs/rules/no-eval
    'no-extend-native': ERROR, // http://eslint.org/docs/rules/no-extend-native
    'no-extra-bind': ERROR, // http://eslint.org/docs/rules/no-extra-bind
    'no-fallthrough': ERROR, // http://eslint.org/docs/rules/no-fallthrough
    'no-floating-decimal': ERROR, // http://eslint.org/docs/rules/no-floating-decimal
    'no-implied-eval': ERROR, // http://eslint.org/docs/rules/no-implied-eval
    'no-lone-blocks': ERROR, // http://eslint.org/docs/rules/no-lone-blocks
    'no-loop-func': ERROR, // http://eslint.org/docs/rules/no-loop-func
    'no-multi-str': ERROR, // http://eslint.org/docs/rules/no-multi-str
    'no-native-reassign': ERROR, // http://eslint.org/docs/rules/no-native-reassign
    'no-new': ERROR, // http://eslint.org/docs/rules/no-new
    'no-new-func': ERROR, // http://eslint.org/docs/rules/no-new-func
    'no-new-wrappers': ERROR, // http://eslint.org/docs/rules/no-new-wrappers
    'no-octal': ERROR, // http://eslint.org/docs/rules/no-octal
    'no-octal-escape': ERROR, // http://eslint.org/docs/rules/no-octal-escape
    'no-param-reassign': ERROR, // http://eslint.org/docs/rules/no-param-reassign
    'no-proto': ERROR, // http://eslint.org/docs/rules/no-proto
    'no-redeclare': ERROR, // http://eslint.org/docs/rules/no-redeclare
    'no-return-assign': OFF, // http://eslint.org/docs/rules/no-return-assign
    'no-script-url': ERROR, // http://eslint.org/docs/rules/no-script-url
    'no-self-compare': ERROR, // http://eslint.org/docs/rules/no-self-compare
    'no-sequences': ERROR, // http://eslint.org/docs/rules/no-sequences
    'no-throw-literal': ERROR, // http://eslint.org/docs/rules/no-throw-literal
    'no-unsafe-finally': OFF, // http://eslint.org/docs/rules/no-unsafe-finally
    'no-with': ERROR, // http://eslint.org/docs/rules/no-with
    radix: ERROR, // http://eslint.org/docs/rules/radix
    'vars-on-top': ERROR, // http://eslint.org/docs/rules/vars-on-top
    'wrap-iife': [ERROR, 'any'], // http://eslint.org/docs/rules/wrap-iife
    yoda: ERROR, // http://eslint.org/docs/rules/yoda

    /**
     * Style
     */
    'prettier/prettier': [
      ERROR,
      {
        trailingComma: 'es5',
        singleQuote: true,
      },
    ],
    camelcase: [
      ERROR,
      {
        // http://eslint.org/docs/rules/camelcase
        properties: 'never',
      },
    ],
    'func-names': WARN, // http://eslint.org/docs/rules/func-names
    'new-cap': [
      ERROR,
      {
        // http://eslint.org/docs/rules/new-cap
        newIsCap: true,
        capIsNew: false,
      },
    ],
    'no-nested-ternary': ERROR, // http://eslint.org/docs/rules/no-nested-ternary
    'no-new-object': ERROR, // http://eslint.org/docs/rules/no-new-object
    'no-underscore-dangle': OFF, // http://eslint.org/docs/rules/no-underscore-dangle
    'one-var': [ERROR, 'never'], // http://eslint.org/docs/rules/one-var
    'spaced-comment': [
      ERROR,
      'always',
      {
        // http://eslint.org/docs/rules/spaced-comment
        markers: ['='], // Sprockets directives
      },
    ],
    // http://eslint.org/docs/rules/no-case-declarations
    // note: you can wrap case bodies in {} blocks if you really want declarations in them
    'no-case-declarations': [ERROR],

    /**
     * JSX style
     */
    'react/display-name': OFF, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/display-name.md
    'react/jsx-boolean-value': OFF, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
    'react/jsx-no-undef': ERROR, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
    'react/jsx-sort-props': OFF, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
    'react/jsx-sort-prop-types': OFF, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-prop-types.md
    'react/jsx-uses-react': ERROR, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
    'react/jsx-uses-vars': ERROR, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
    'react/no-did-mount-set-state': OFF, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-mount-set-state.md
    'react/no-did-update-set-state': ERROR, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
    'react/no-multi-comp': OFF, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
    'react/no-unknown-property': ERROR, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
    'react/prop-types': ERROR, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
    'react/react-in-jsx-scope': ERROR, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
    'react/sort-comp': [
      ERROR,
      {
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
        order: [
          'displayName',
          'propTypes',
          'contextTypes',
          'childContextTypes',
          'mixins',
          'statics',
          'defaultProps',
          'getDefaultProps',
          'getInitialState',
          'getChildContext',
          'constructor',
          'componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount',
          'everything-else',
          '/^get.+$/',
          '/^handle.+$/',
          '/^render.+$/',
          'render',
        ],
      },
    ],

    /**
     * ES6 imports
     */
    // in addition to the extended plugin:import/errors config
    'import/no-named-as-default-member': ERROR,
    'import/no-duplicates': ERROR,

    /**
     * Flow types
     */
    'flowtype/define-flow-type': WARN,
    'flowtype/use-flow-type': WARN,
  },
};
