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
  //--------------------------
  // baseプロパティに設定する値
  //--------------------------
  let product = 'honban/';
  product = './';
  //let base = product; //dev_url: localhost/product/...
  //importを絶対パスで記述するために必要root
  const root = resolve(__dirname, product); //固定 index.html の場所

  // 本番時に適用させるbaseの値
  // if (mode === 'production') {
  // if (command === 'build') {
  //   //ビルド  process.env.BASE_URLになる
  //   //build_url: <home>/cgi-bin/hanareact/js/product/...
  //   base = '/cgi-bin/hanareact/js/' + product;
  // }
  return {
    // `root` からの相対パスで `tsconfig.json` の場所を指定する
    plugins: [react(), tsconfigPaths()], //{ root: '../' }
    resolve: {
      alias: [
        { find: '~/', replacement: `${__dirname}/public/` },
        // { find: '@/', replacement: `${__dirname}/src/` },
        // { find: "@", replacement: path.resolve(__dirname, "src") },
      ],
    },
    server: {
      //port: 3000,
      //open:true 自動でブラウザを開く
      open: true,
      proxy: {
        //リクエストパスがそのキーで始まるすべてのリクエストは、その指定されたターゲットにプロキシされます
        //URL:http://localhost:5173/cgi-bin/webcalhana/data/yearly365.txt
        //Url:http://localhost:5173/cgi-bin/webcalhana/hanafullcal.py?start=2024-11-30&end=2025-01-17
        //    ->https://hanamaru8700.com/
        '/cgi-bin/webcalhana': {
          target: 'https://hanamaru8700.com/',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
        //http://localhost:4173/honban/assets/honban-bundle.js
        // '/cgi-bin/hanareact/js': {
        //   target: 'http://localhost:4173/honban/',
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace("/cgi-bin/hanareact/js/", ''),
        // },
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
    //(__dirname,) が vite.config.js ファイルのフォルダになることに注意してください。
    // baseプロパティをbase変数で指定↓
    base: '/cgi-bin/hanareact/js/', //base,

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
      //デフォルトでは、Vite はビルド時にファイルを publicDir から outDir にコピーします。
      //↑ Vite はディレクトリから出力フォルダにすべてのファイルをコピーするため無効
      rollupOptions: {
        // input: {
        //   // child: resolve(root, 'honban101', 'index.html'),
        //   "main": resolve('src', 'honban', 'index.html'),
        // },
        // bundle.jsを差し替えする
        input: {
          // honban: 'src/honban/index.html',//<--ダメ
          // honban: `src/honban/index.html`,//<--ダメ
          main: resolve(__dirname, 'index.html'),
          honban: resolve(__dirname, './honban/index.html'),
        },
        output: {
          //base/assets/[name]-bundle.js
          //name:default is index
          entryFileNames: `assets/[name]-bundle.js`,
          assetFileNames: `assets/[name]-style.css`,
        },
      },
    },
  };
});
