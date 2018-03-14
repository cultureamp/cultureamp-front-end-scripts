// shared config for babel
module.exports = {
  presets: [
    [
      'env',
      {
        modules: false, // prefer Webpack's native module support (with tree shaking)
        loose: true,
      },
    ],
    'stage-2',
    'react',
  ],
  plugins: ['transform-proto-to-assign'],
};
