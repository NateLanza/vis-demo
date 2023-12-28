/**
 * Creates a proxy for the backend server API
 * using the http-proxy-middleware package.
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

