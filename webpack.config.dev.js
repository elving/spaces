const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    'webpack-hot-middleware/client?reload=true',
    './app/client.js'
  ],

  output: {
    path: path.join(__dirname, 'app/public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },

  module: {
    loaders: [{
      test: /\.js$|\.jsx$|\.es6$|\.babel$/,
      loader: 'babel',
      exclude: /node_modules/,
      include: path.join(__dirname, 'app'),
      query: {
        presets: ['es2015', 'stage-0', 'react'],
        plugins: [
          ['react-transform', {
            transforms: [{
              locals: ['module'],
              imports: ['react'],
              transform: 'react-transform-hmr'
            }, {
              imports: ['react', 'redbox-react'],
              transform: 'react-transform-catch-errors'
            }]
          }]
        ]
      }
    }, {
      test: /\.css$/,
      loader: 'style!css?sourceMap!postcss!',
      exclude: /node_modules/,
      include: path.join(__dirname, 'app/styles')
    }]
  },

  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] })
  ],

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  resolve: {
    root: path.join(__dirname, 'app'),
    extensions: ['', '.js', '.jsx', '.css'],
    modulesDirectories: ['node_modules']
  }
}
