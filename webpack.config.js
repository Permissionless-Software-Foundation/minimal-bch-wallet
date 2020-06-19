const path = require('path')

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'minimal-bch-wallet.min.js',
    path: path.resolve(__dirname, 'dist')
  },

  // Prevent errors about the native node.js fs library.
  node: {
    fs: 'empty'
  }
}
