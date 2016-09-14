const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  debug: false,

  devtool: 'source-map',

  entry: './build/client.js',

  stats: {
    colors: true,
    reasons: false
  },

  output: {
    path: path.join(__dirname, 'build/public'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      compress: { warnings: false },
      minimize: true
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin('bundle.css')
  ],

  module: {
    loaders: [{
      test: /\.js$|\.jsx$|\.es6$|\.babel$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'stage-0', 'react'],
        plugins: [
          'syntax-async-functions',
          'transform-async-to-generator',
          'transform-regenerator',
          'transform-runtime',
          'transform-object-rest-spread'
        ]
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        'style', 'css-loader?sourceMap!postcss-loader!'
      ),
      exclude: /node_modules/,
      include: path.join(__dirname, 'build/styles')
    }]
  },

  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] })
  ],

  resolve: {
    root: path.join(__dirname, 'build'),
    extensions: ['', '.js', '.jsx', '.css'],
    modulesDirectories: ['node_modules']
  }
}
