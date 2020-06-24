module.exports = {
  devServer: {
    host: 'localhost',
    port: 8082,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
    },
    proxy: {
      '^/mapproxy': {
        target: 'localhost/mapproxy',
        changeOrigin: true,
      },
      '^/geoserver': {
        target: 'localhost/geoserver',
        changeOrigin: true,
      },
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
};
