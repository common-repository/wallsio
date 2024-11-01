// webpack v4

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: './js/index.js',
    tinymce: './js/tinymce.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true }},
          { loader: MiniCssExtractPlugin.loader, options: { sourceMap: true }},
          { loader: 'css-loader', options: { sourceMap: true }},
          { loader: 'postcss-loader', options: { sourceMap: true }},
          { loader: 'sass-loader', options: { sourceMap: true } }
        ],
      },
      {
        test: /\.tpl$/,
        loader: 'underscore-loader',
        options: {
          engine: '',
          minifierOptions: {
            removeComments: false,
          }
        },
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist', {} ),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ]
};
