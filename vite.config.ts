import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
// import { join } from 'path';
import { resolve } from 'path';

//__dirname=working directly
const root = resolve(__dirname, 'src'); //固定 index.html の場所
// const outDir = resolve(__dirname, 'dist'); //固定
// https://vitejs.dev/config/
//\Users\hanamaru\Documents\INFO\%E9%96%8B%E7%99%BA%E7%94%A8\js\react-tsx-app001\src

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  // baseプロパティに設定する値
  const product = 'honban';
  let base = product;

  // 本番時に適用させるbaseの値
  // if (mode === 'production') {
  if (command === 'build') {
    //ビルド
    base = '/cgi-bin/hanareact/js/' + product;
  }
  return {
    plugins: [react(), tsconfigPaths()],
    // plugins: [react()],
    resolve: {
      alias: [
        { find: '@/', replacement: `${__dirname}/src/` },
        // { find: '~/', replacement: `${__dirname}/public/` },
        // { find: "@", replacement: path.resolve(__dirname, "src") },
      ],
    },
    // コンパイル後のベースアドレス,dev,build
    // ビルド後のindex.htmlファイル内でのcss,javascriptのリンクを相対にする
    //  <script src="./assets/honban101-bundle.js"></script>
    //  <link  href="./assets/honban101-txyeWEEk.css">
    //__dirname が vite.config.js ファイルのフォルダになることに注意してください。
    // baseプロパティをbase変数で指定
    base: base,
    // index.html の場所
    // root: root,
    // build.outDir オプションでビルドファイルの出力場所を指定できる
    // publicDir: 'public',
    build: {
      // 出力ディレクトリーを指定します（プロジェクトルートからの相対パス）。
      // `root` からの相対パスで指定する
      // outDir,
      // outDir: '../../dist',
      // 存在しないときはフォルダを作成するDefault:true
      // emptyOutDir: true,
      copyPublicDir: false,
      //Vite はディレクトリから出力フォルダにすべてのファイルをコピーするため無効
      rollupOptions: {
        // input: {
        //   // child: resolve(root, 'honban101', 'index.html'),
        //   "main": resolve('src', 'honban', 'index.html'),
        // },
        // bundle.jsを差し替えする
        input: {
          // honban: 'src/honban/index.html',//<--ダメ
          // honban: `src/honban/index.html`,//<--ダメ
          honban: resolve(root, product, 'index.html'),
        },
        output: {
          //base/assets/[name]-bundle.js
          //name:default:index
          entryFileNames: `assets/[name]-bundle.js`,
          assetFileNames: `assets/[name]-style.css`,
        },
      },
    },
  };
});
