/**
 * Creates a proxy for the backend server API
 * using the http-proxy-middleware package.
 * 
 * Unforunately, this file doesn't work if it's
 * typescript- I think React is looking for the
 * .js filename. I'm not bothering to figure out
 * how to fix that for this demo.
 * @module setupProxy
 */

const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy.createProxyMiddleware({
      target: 'http://localhost:5000/',
      changeOrigin: true,
    })
  );
};

