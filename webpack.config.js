const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  plugins: [new HtmlWebpackPlugin({
    template: './index.html',
  })],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
};