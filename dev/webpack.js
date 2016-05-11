module.exports = function (conf) {
  var webpack = require('webpack'),
      compiler = webpack(conf.config),
      middleware = require("webpack-dev-middleware")(compiler,{
        publicPath: conf.config.output.publicPath,
        watchOptions: {
          aggregateTimeout: 2e3,
          poll: true
        },
        noInfo: true,
        lazy: true
      })
  return middleware;
}
   