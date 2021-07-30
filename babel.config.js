module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: ['@babel/plugin-transform-typescript', '@vue/babel-plugin-jsx'],
  env: {
    cjs: {
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
}
