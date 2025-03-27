import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  base: '/mogobon.github.io/', 
  build: {
    outDir: 'dist', // 出力先ディレクトリを dist に設定
  },
  plugins: [solid()],
});
