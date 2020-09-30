const { createProxyMiddleware } = require('http-proxy-middleware');
const { isUserSessionActive } = require('../utils/session');

module.exports = (proxyPath, app, provider) => {
  const localUsername = 'gis_infra';
  const localPassword = 'gis_infra';

  const GEOSERVER_USERNAME = process.env.NODE_ENV === 'development'
    ? localUsername : process.env.GEOSERVER_USERNAME;
  const GEOSERVER_PASSWORD = process.env.NODE_ENV === 'development'
    ? localPassword : process.env.GEOSERVER_PASSWORD;

  const MAPPROXY_USERNAME = process.env.NODE_ENV === 'development'
    ? localUsername : process.env.MAPPROXY_USERNAME;
  const MAPPROXY_PASSWORD = process.env.NODE_ENV === 'development'
    ? localPassword : process.env.MAPPROXY_PASSWORD;

  const NOMINATIM_USERNAME = process.env.NODE_ENV === 'development'
    ? localUsername : process.env.NOMINATIM_USERNAME;
  const NOMINATIM_PASSWORD = process.env.NODE_ENV === 'development'
    ? localPassword : process.env.NOMINATIM_PASSWORD;

  app.use(proxyPath, async(req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
      return next();
    }

    if (await isUserSessionActive(provider, req, res)) {
      return next();
    }

    res.sendStatus(403);
  });

  app.use(`${proxyPath}/mapproxy`, createProxyMiddleware({
    target: 'http://mapproxy:8083',
    auth: `${MAPPROXY_USERNAME}:${MAPPROXY_PASSWORD}`,
    changeOrigin: true,
    pathRewrite: {
      ['^/proxy/mapproxy']: '',
    },
  }));

  app.use(`${proxyPath}/geoserver`, createProxyMiddleware({
    target: 'http://geoserver:8080',
    auth: `${GEOSERVER_USERNAME}:${GEOSERVER_PASSWORD}`,
    changeOrigin: true,
    pathRewrite: {
      ['^/proxy/geoserver']: '/geoserver',
    },
  }));

  app.use(`${proxyPath}/nominatim`, createProxyMiddleware({
    target: 'http://nominatim:8100',
    auth: `${NOMINATIM_USERNAME}:${NOMINATIM_PASSWORD}`,
    changeOrigin: true,
    pathRewrite: {
      ['^/proxy/nominatim']: '',
    },
  }));
}
