
module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8081,
    public: '0.0.0.0:8081',
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000,
    },
    // proxy: {
      // '^/api': {
      //   target: '0.0.0.0:8082',
      //   changeOrigin: true
      // },
      // '^/mapproxy': {
      //   target: '0.0.0.0:8083',
      //   changeOrigin: true
      // }
    // }
  }
};
