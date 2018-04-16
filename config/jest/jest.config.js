module.exports = {
  verbose: true,
  rootDir: process.env.PWD,
  automock: false,
  timers: 'fake',
  transform: {
    '.*':
      '<rootDir>/node_modules/cultureamp-front-end-scripts/config/jest/babel/preprocessor.js',
  },
  setupFiles: [
    '<rootDir>/node_modules/cultureamp-front-end-scripts/config/jest/utils/setupShim.js',
    '<rootDir>/node_modules/babel-polyfill/lib/index.js',
  ],
  setupTestFrameworkScriptFile:
    '<rootDir>/node_modules/cultureamp-front-end-scripts/config/jest/setupTestFramework.js',
  cacheDirectory: '<rootDir>/tmp/cache/jest',
  transformIgnorePatterns: [
    '/node_modules/(?!cultureamp-style-guide)/.*\\.js$',
  ],
  moduleDirectories: ['node_modules', 'src'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/tmp'],
  roots: ['<rootDir>/src'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.js$',
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
};
