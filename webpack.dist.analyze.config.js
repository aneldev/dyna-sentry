// help: http://webpack.github.io/docs/configuration.html
// help: https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const package_ = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const rules = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

const distConfig = {
  mode: "development",  // do not minify the code, this part of the app, not of the module
  target: 'web',        // help: https://webpack.github.io/docs/configuration.html#target
  entry: './src/index.ts',
  externals: [nodeExternals()].concat(['fs', 'path']), // in order to ignore all modules in node_modules folder
  optimization: {
    usedExports: true,       // true to remove the dead code, for more https://webpack.js.org/guides/tree-shaking/
  },
  devtool: "source-map",     // help: https://webpack.js.org/configuration/devtool/
  output: {
    path: path.resolve(__dirname, 'temp/dist'),
    filename: '[name].js',
    publicPath: '/temp/dist/',
    library: package_.name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    alias: {},
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules,
  },
  plugins: [
  ].concat(plugins),
};

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const analyzeConfig = {...distConfig};
analyzeConfig.externals = undefined;
analyzeConfig.output.path = path.resolve(__dirname, 'temp/build-analyze');
analyzeConfig.output.publicPath = '/temp/build-analyze';
analyzeConfig.plugins.push(new BundleAnalyzerPlugin());


module.exports = analyzeConfig;
