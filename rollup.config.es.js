import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
const extensions = ['.ts', '.tsx']

export default [
  {
    input: './packages/vue-img/src/index.ts',
    external: ['@robot-img/utils', 'vue'],
    output: {
      file: './packages/vue-img/dist/vue-img.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [nodeResolve({ extensions }), babel({ babelHelpers: 'inline', extensions })],
  },
]
