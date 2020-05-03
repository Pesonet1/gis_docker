
module.exports = {
  devServer: {
    host: 'localhost', // '0.0.0.0',
    port: 8081,
    // public: '0.0.0.0:8081',
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    proxy: {
      // '^/api': {
      //   target: '0.0.0.0:8082',
      //   changeOrigin: true
      // },
      '^/mapproxy': {
        target: 'localhost:8083',
        changeOrigin: true
      },
      '^/geoserver': {
        target: 'localhost:8080',
        changeOrigin: true
      }
    }
  }
};
