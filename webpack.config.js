const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin
const path = require('path')
const deps = require('./package.json').dependencies

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'dist'),
    port: 8080,
    historyApiFallback: true,
    hot: false,
    hotOnly: false
  },
  resolve: {
    alias: {
      events: 'events'
    }
  },
  output: {
    publicPath: `http://localhost:8080/`,
    chunkFilename: '[id].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'application_name',
      library: { type: 'var', name: 'application_name' },
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {},
      shared: [
        {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}