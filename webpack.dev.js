const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const common = require('./webpack.common.js');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { SourceMapDevToolPlugin, DefinePlugin } = require('webpack');
const { getLocaleLang, getCleanPlugin, getLocaleFile, getOutputFolder, getPublicPath } = require('./i18n-helper');
const fs = require('fs');

const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'scripts', 'vendor', 'main'];
const projectRoot = process.cwd();

const getDevelopmentConfig = (env) => {
  const htmlWebpackPluginTemplate = './src/index.ejs';

  const devConfig = merge(common, {
    mode: 'development', // Webpack 5 requires explicit mode
    devtool: 'eval',
    output: {
      path: getOutputFolder(env, true),
      publicPath: getPublicPath(env),
      filename: '[name].bundle.js',
      chunkFilename: '[id].chunk.js',
      crossOriginLoading: false
    },
    plugins: [
      // Clean the output folder
      getCleanPlugin(env, true), // your helper function already updated for CleanWebpackPlugin v4
      // Define global variables
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        _g_prod: false,
        _g_version: JSON.stringify('0.0.0')
      }),
      // HTML template
      new HtmlWebpackPlugin({
        template: htmlWebpackPluginTemplate,
        filename: 'index.ejs',
        hash: false,
        inject: true,
        compile: true,
        favicon: false,
        minify: false,
        cache: false,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        title: env.locale === 'en' ? 'TickerChart Net' : 'تكرتشارت نت',
        xhtml: true,
        buildLanguage: env.locale,
        redirectUrl: env.locale === 'en' ? '/app/ar' : '/app/en',
        scriptBundleUrl:
          env.locale === 'en' ? '/app/en/scripts.bundle.js' : '/app/ar/scripts.bundle.js',
        chunksSortMode: function sort(left, right) {
          const leftIndex = entryPoints.indexOf(left.name);
          const rightIndex = entryPoints.indexOf(right.name);
          if (leftIndex > rightIndex) return 1;
          if (leftIndex < rightIndex) return -1;
          return 0;
        }
      }),
      // Detect circular dependencies
      new CircularDependencyPlugin({
        exclude: /(\\|\/)node_modules(\\|\/)/,
        failOnError: false,
        onDetected: false,
        cwd: projectRoot
      }),
      // Source maps for development
      new SourceMapDevToolPlugin({
        filename: '[file].map[query]',
        moduleFilenameTemplate: '[resource-path]',
        fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
        sourceRoot: 'webpack:///'
      }),
      // Replace script bundle dynamically
      new ReplaceInFileWebpackPlugin([
        {
          dir: getOutputFolder(env, true),
          files: ['index.ejs'],
          rules: [
            {
              search: 'scripts.bundle.js',
              replace: function (match) {
                const files = fs.readdirSync(getOutputFolder(env, true));
                for (let i = 0; i < files.length; i++) {
                  if (files[i].startsWith('scripts.') && files[i].endsWith('.bundle.js')) {
                    return files[i];
                  }
                }
                return match;
              }
            }
          ]
        }
      ])
    ],
    optimization: {
      moduleIds: 'named' // human-readable module names in dev
    },
    // Webpack 5 no longer needs legacy node polyfills
    node: false,
    //TODO remove this devserver
    devServer: {
      static: {
        directory: getOutputFolder(env, true), // your build output folder
      },
      compress: true,
      port: 4200, // the port to open
      open: true, // open browser automatically
      hot: true,
      historyApiFallback: true
    }
  });

  return devConfig;
};

module.exports = (env) => {
  const buildEnv = env || { locale: 'ar', build_element: false };
  return getDevelopmentConfig(buildEnv);
};
