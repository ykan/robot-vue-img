import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
const extensions = ['.js', '.jsx', '.ts', '.tsx']
export default [
  {
    input: './packages/vue-img/src/index.ts',
    external: ['@robot-img/utils', 'vue'],
    output: {
      file: './packages/vue-img/dist/vue-img.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        extensions,
      }),
      commonjs(),
      babel({ babelHelpers: 'inline', extensions }),
    ],
  },
]
