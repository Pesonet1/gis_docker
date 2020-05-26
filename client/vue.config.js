
module.exports = {
  devServer: {
    host: 'localhost', // '0.0.0.0',
    port: 8082,
    // public: '0.0.0.0:8082',
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    proxy: {
      '^/mapproxy': {
        target: 'localhost/mapproxy',
        changeOrigin: true
      },
      '^/geoserver': {
        target: 'localhost/geoserver',
        changeOrigin: true
      }
    }
  }
};
