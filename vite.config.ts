import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { join } from 'path';
// import { resolve } from 'path';

// const root = resolve(__dirname, 'src');
// const outDir = resolve(__dirname, 'dist');

// https://vitejs.dev/config/

// ビルド設定は vite.config.js を編集して行います。
// 独自の設定とRollupの設定をここで書けます。
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: [
      { find: '@/', replacement: `${__dirname}/src/` },
      { find: '~/', replacement: `${__dirname}/public/` },
      // { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
  base: './',
  // index.html の場所
  // root,
  // build.outDir オプションでビルドファイルの出力場所を指定できる
  root: '.',
  build: {
    // `root` からの相対パスで指定する
    // outDir,
    // 存在しないときはフォルダを作成する
    emptyOutDir: true,
    rollupOptions: {
      // input: {
      //   // http://localhost:5173/sample1/
      //   // sample1: resolve(root, 'sample1', 'index.html'),
      //   // sample2: resolve(root, 'sample2', 'index.html'),
      //   // sample1: resolve(root, 'sample1', 'index.html'),
      //   '': join('.', 'index.html'),
      // },
      // bundle.jsを差し替えする
      output: {
        // entryFileNames: `assets/[name]/bundle.js`,
        entryFileNames: `assets/bundle.js`,
      },
    },
  },
});
