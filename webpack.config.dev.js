/*
 * 直接打包至 wewbTmp 目录，调试用
 */
const webpack = require('webpack')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const DIST_PATH = './wewebTmp/dist/script'
const isProd = process.env.NODE_ENV === 'production'
const showAnalysis = process.env.ANA === 'true'
const watch = process.env.WATCH === 'true'
// 将 css 从文本中提取出来，参数为资源存放的位置
let plugins = [new ExtractTextPlugin('../css/weweb.min.css')]
if (showAnalysis) {
  plugins = plugins.concat([new BundleAnalyzerPlugin()])
}
if (isProd) {
  plugins = plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        dead_code: true,
        properties: true,
        evaluate: true
      },
      output: {
        comments: false
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ])
}

function getPath (rPath) {
  return path.resolve(__dirname, rPath)
}

function getSourcePath (rPath) {
  return getPath(`./src/${rPath}`)
}

module.exports = {
  entry: {
    weweb: getSourcePath('index.js')
  },
  output: {
    filename: '[name].js',
    publicPath: 'script/',
    chunkFilename: '[name].wd.chunk.js',
    path: getPath(DIST_PATH)
  },
  watch: watch,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env', 'stage-0']
        }
      },
      {
        test: /\.html/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: { minimize: true }
          }
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          // 注意此处 outputPath 为输出结果的地址
          'file-loader?name=[name].[ext]&publicPath=&outputPath=../images/'
          // 'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
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
  plugins: plugins
}
