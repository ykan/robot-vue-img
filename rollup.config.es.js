import { babel } from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: './packages/vue-img/src/index.ts',
    external: ['@robot-img/utils'],
    output: {
      file: './packages/vue-img/dist/vue-img.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tslib: './node_modules/typescript/lib',
      }),
      babel({ babelHelpers: 'inline', extensions: ['.ts', '.tsx'] }),
    ],
  },
]
