import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  base: '/', // または './' に変更
  build: {
    outDir: 'dist',
  },
  plugins: [solid()],
});
