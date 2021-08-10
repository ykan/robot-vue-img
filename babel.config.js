module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    ['@babel/proposal-object-rest-spread', { loose: true }],
    // '@babel/plugin-transform-runtime',
  ],
  env: {
    // cjs: {
    //   plugins: ['@babel/plugin-transform-runtime'],
    // },
    test: {
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
}
