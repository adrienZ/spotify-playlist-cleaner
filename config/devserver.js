// =======================================================================//
// !  CONFIG DEV SERVER                                                   //
// =======================================================================//
const ip = require('ip')
// const urls = require("./urls");

module.exports = {
  // contentBase: urls.dev.base,
  // watchContentBase: true, // enable reload on save for html
  // change this as you want
  compress: true, //gzip
  inline: true,
  noInfo: true,
  overlay: {
    warnings: false,
    errors: true,
  },
  historyApiFallback: true,
  hot: true,
  https: false,
  open: false,
  progress: false,
  port: 3000,
  quiet: false, // shut down console,
}
