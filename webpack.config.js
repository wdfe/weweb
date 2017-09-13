const webpack = require('webpack')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const DIST_PATH = './tmp/public/script'

const getPath = function (rPath) {
  return path.resolve(__dirname, rPath)
}

const getSourcePath = function (rPath) {
  return getPath(`./src/${rPath}`)
}

module.exports = {
  entry: {
    view: getSourcePath('view.js'),
    service: getSourcePath('service.js')
  },
  output: {
    filename: '[name].js',
    path: getPath(DIST_PATH)
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.html/,
        loader: 'html-loader'
      },
      {
        test: /\.et/,
        loader: 'ei-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  stats: {
    modulesSort: 'size',
    chunksSort: 'size',
    assetsSort: 'size'
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   output: {
    //     comments: false
    //   }
    // }),
    // new BundleAnalyzerPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
