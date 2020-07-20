const webpack = require('webpack')
const { resolve } = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  entry: resolve(__dirname, 'src/index.js'),
  externals: [nodeExternals()], // in order to exclude all node_modules from bundle
  output: {
    publicPath: '/',
    path: resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [resolve(__dirname, 'src')],
  },
  devtool: 'sourceMap',
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // For some reason the babelrc isn't picked up
            configFile: resolve(__dirname, '.babelrc.js'),
          },
        },
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
    }),
  ],
}
