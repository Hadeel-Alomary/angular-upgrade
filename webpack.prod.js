const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const fs = require('fs');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const { DefinePlugin, LoaderOptionsPlugin, optimize } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const { AngularCompilerPlugin } = require('@ngtools/webpack'); // Optional
const entryPoints = ["inline", "polyfills", "sw-register", "styles", "scripts", "vendor", "main"];
const { getOutputFolder, getLocaleFile, getCleanPlugin, getLocaleLang, getPublicPath } = require("./i18n-helper");

const getVersion = (env) => {
  let version = fs.readFileSync(path.join(process.cwd(), "version.txt"), 'utf8');
  if (env.locale === "en") return JSON.stringify(version);

  let parts = version.split('.');
  parts[parts.length - 1] = parseInt(parts[parts.length - 1]) + 1;
  version = parts.join('.');
  fs.writeFileSync(path.join(process.cwd(), "version.txt"), version, 'utf8');
  return JSON.stringify(version);
};

const getProductionConfig = (env) => merge(common, {
  mode: 'production',
  output: {
    path: getOutputFolder(env, false),
    filename: '[name].[chunkhash].bundle.js',
    publicPath: getPublicPath(env),
    clean: true // automatically cleans old dist files
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: 'single'
  },
  performance: {
    maxAssetSize: 2000000,
    maxEntrypointSize: 2000000,
    hints: 'warning'
  },
  plugins: [
    getCleanPlugin(env, false),
    new CleanWebpackPlugin(), // Webpack 5 style
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      _g_prod: true,
      _g_version: getVersion(env)
    }),
    // new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      filename: './index.ejs',
      inject: 'body',
      hash: true,
      chunks: 'all',
      title: env.locale === 'en' ? 'TickerChart Net' : 'تكرتشارت نت',
      buildLanguage: env.locale,
      redirectUrl: env.locale === 'en' ? '/app/ar' : '/app/en',
      scriptBundleUrl: env.locale === 'en' ? '/app/en/scripts.bundle.js' : '/app/ar/scripts.bundle.js',
      chunksSortMode: (left, right) => entryPoints.indexOf(left.name) - entryPoints.indexOf(right.name)
    }),
    /*
    new AngularCompilerPlugin({
        mainPath: 'main.ts',
        platform: 0,
        hostReplacementPaths: { 'environments\\environment.ts': 'environments\\environment.ts' },
        sourceMap: false,
        tsConfigPath: './tsconfig.json',
        skipCodeGeneration: false,
        compilerOptions: {},
        locale: getLocaleLang(env),
        i18nInFile: getLocaleFile(env)
    }),
    */
    new LoaderOptionsPlugin({ minimize: true, debug: false }),
    new optimize.AggressiveMergingPlugin(),
    new ReplaceInFileWebpackPlugin([{
      dir: getOutputFolder(env, false),
      files: ['index.ejs'],
      rules: [{
        search: 'scripts.bundle.js',
        replace: (match) => {
          const files = fs.readdirSync(getOutputFolder(env, false));
          for (const file of files) {
            if (file.startsWith('scripts.') && file.endsWith('.bundle.js')) return file;
          }
          return match;
        }
      }]
    }])
  ]
});

module.exports = env => getProductionConfig(env);
