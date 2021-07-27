import * as path from 'path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@robot-img/vue-img': path.join(__dirname, './packages/vue-img/src/index.ts'),
    },
  },
  base: './',
  build: {
    outDir: '_site',
  },
  server: {
    open: '/docs/',
  },
})
