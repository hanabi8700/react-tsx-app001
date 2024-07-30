import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
// import { join } from 'path';
import { resolve } from 'path';

//__dirname= working directly;//vite.config.tsがある場所
// const root = resolve(__dirname, 'src'); //固定 index.html の場所
// const outDir = resolve(__dirname, 'dist'); //固定
// https://vitejs.dev/config/
//\Users\hanamaru\Documents\INFO\%E9%96%8B%E7%99%BA%E7%94%A8\js\react-tsx-app001\src

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  // baseプロパティに設定する値
  const product = 'honban';
  let base = product; //dev時のpash値 localhost/product/...
  const root = resolve(__dirname, product); //固定 index.html の場所

  // 本番時に適用させるbaseの値
  // if (mode === 'production') {
  if (command === 'build') {
    //ビルド
    base = '/cgi-bin/hanareact/js/' + product;
  }
  return {
    // `root` からの相対パスで `tsconfig.json` の場所を指定する
    plugins: [react(), tsconfigPaths()], //{ root: '../' }
    resolve: {
      alias: [
        // { find: '@/', replacement: `${__dirname}/src/` },
        { find: '~/', replacement: `${__dirname}/public/` },
        // { find: "@", replacement: path.resolve(__dirname, "src") },
      ],
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/cgi-bin': {
          target: 'https://hanamaru8700.com/',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/cal': {
          target:
            'https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/cal/, ''),
        },
      },
    },
    // # "https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/webcal",
    // # "https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday",
    // # "https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday003",

    // コンパイル後のベースアドレス,dev,build
    // ビルド後のindex.htmlファイル内でのcss,javascriptのリンクを相対にする
    //  <script src="./assets/honban101-bundle.js"></script>
    //  <link  href="./assets/honban101-txyeWEEk.css">
    //__dirname が vite.config.js ファイルのフォルダになることに注意してください。
    // baseプロパティをbase変数で指定↓
    base: base,
    // index.html の場所↓
    root: root,
    // publicDir: 'public',
    //デフォルトでは .env の場所は vite.config.js の root の場所↓
    // envDir: '../../',//vite.configと同じ場所
    build: {
      // build.outDir オプションでビルドファイルの出力場所を指定できる↓
      // 出力ディレクトリーを指定します（プロジェクトルートからの相対パス）。
      // `root` からの相対パスで指定する
      // outDir,
      // outDir: '../dist',
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
          honban: resolve(root, 'index.html'),
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
