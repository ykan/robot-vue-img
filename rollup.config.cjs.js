import { babel } from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    input: './packages/vue-img/src/index.ts',
    external: ['@robot-img/utils'],
    output: {
      file: './packages/vue-img/dist/vue-img.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      typescript({
        exclude: ['docs/**/*.ts?(x)'],
        tslib: './node_modules/typescript/lib',
      }),
      babel({ babelHelpers: 'runtime', extensions: ['.ts', '.tsx'] }),
      commonjs(),
    ],
  },
]
