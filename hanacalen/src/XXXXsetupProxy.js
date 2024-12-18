// import proxy from 'http-proxy-middleware';

import * as express from 'express';
import {
  createProxyMiddleware,
  // Filter,
  // Options,
  // RequestHandler,
} from 'http-proxy-middleware';

const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://hanamaru8700.com/cgi-bin/webcalhana/',

    changeOrigin: true,
    // headers: headers,
  }),
);

app.listen(3000);

// proxy and keep the same base path "/api"
// http://127.0.0.1:3000/api/foo/bar -> http://www.example.org/api/foo/bar
// module.exports = function (app) {
//   const headers = {
//     'Content-Type': 'application/json',
//   };
//   app.use(
//     proxy('/api/v1/', {
//       target:
//         'https://hanamaru8700.com/cgi-bin/webcalhana/hanafullcal.py?start=2024-07-01&end=2024-08-05',

//       changeOrigin: true,
//       secure: false,
//       headers: headers,
//     }),
//   );
// };
