const { merge } = require('webpack-merge');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin, IgnorePlugin } = require('webpack');

// CSS & JS bundles
const bundledCssFiles = [
  path.join(process.cwd(), 'src/static-libraries/vendor/slick/css/smoothness/jquery-ui-1.8.16.custom.css'),
  path.join(process.cwd(), 'src/static-libraries/vendor/slick/slick.grid.css'),
  path.join(process.cwd(), 'src/static-libraries/vendor/chart/css/bootstrap-datetimepicker.min.css'),
  path.join(process.cwd(), 'src/static-libraries/vendor/chart/css/bootstrap-select.min.css'),
  path.join(process.cwd(), 'src/static-libraries/vendor/chart/css/scxNumericField.min.css'),
  path.join(process.cwd(), 'src/static-libraries/vendor/chart/css/spectrum.min.css'),
  path.join(process.cwd(), 'src/styles.scss')
];

const bundledJsFiles = [
  './src/static-libraries/vendor/slick/lib/jquery-1.7.min.js',
  './src/static-libraries/vendor/slick/lib/jquery-ui-1.8.16.custom.min.js',
  './src/static-libraries/vendor/slick/lib/jquery.event.drag-2.2.js',
  './src/static-libraries/vendor/perfect-scrollbar/perfect-scrollbar.js',
  './src/static-libraries/vendor/slick/slick.core.js',
  './src/static-libraries/vendor/slick/slick.grid.js',
  './src/static-libraries/vendor/slick/slick.dataview.js',
  './src/static-libraries/vendor/slick/plugins/slick.rowselectionmodel.js',
  './src/static-libraries/vendor/slick/plugins/slick.autocolumnsize.js',
  './src/static-libraries/vendor/chart/scripts/cdn/jquery.min.js',
  './src/static-libraries/vendor/chart/scripts/cdn/bootstrap.min.js',
  './src/static-libraries/vendor/chart/scripts/jquery-ui.min.js',
  './src/static-libraries/vendor/chart/scripts/moment.min.js',
  './src/static-libraries/vendor/chart/scripts/html2canvas.min.js',
  './src/static-libraries/vendor/chart/scripts/switchery.js',
  './src/static-libraries/vendor/chart/scripts/bootstrap-select.js',
  './src/static-libraries/vendor/chart/scripts/spectrum.js',
  './src/static-libraries/vendor/chart/scripts/bootstrap-datetimepicker.min.js',
  './src/static-libraries/vendor/base64/base64.js',
  './src/static-libraries/vendor/prng4/prng4.js',
  './src/static-libraries/vendor/rng/rng.js',
  './src/static-libraries/vendor/rsa/rsa.js',
  './src/static-libraries/vendor/jsbn/jsbn.js',
  './src/static-libraries/vendor/jsencrypt/jsencrypt.js'
];
const vendorScripts = bundledJsFiles.map(file => `script-loader!${file}`);
module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['./node_modules'],
    alias: {
      img: path.join(process.cwd(), 'src/static/img/'),
      font: path.join(process.cwd(), 'src/static/font/')
    },
    mainFields: ['browser', 'module', 'main']
  },
  entry: {
    main: ['./src/main.ts'],
    polyfills: ['./src/polyfills.ts'],
    styles: bundledCssFiles,
    vendor: vendorScripts, // all bundled JS in one entry
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: true,
          removeAttributeQuotes: false,
          caseSensitive: true,
          customAttrSurround: [[/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/]],
          customAttrAssign: [/\)?\]?=/]
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg)$/,
        type: 'asset/resource',
        generator: { filename: 'static/font/[name][ext]' ,publicPath: '/app/static/font/'}
      },
      {
        test: /\.(jpg|png|webp|gif|otf|ani|ico|cur)$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: 10 * 1024 } },
        generator: { filename: 'static/img/[name][hash:7][ext]' ,publicPath: '/app/static/img/' }
      },
      {
        exclude: bundledCssFiles,
        test: /\.css$/,
        use: ['exports-loader?module.exports.toString()', 'css-loader']
      },
      {
        include: bundledCssFiles,
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        include: bundledCssFiles,
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.ts$/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
    new CopyWebpackPlugin({
      patterns: [
        // { from: 'src/assets', to: '../', globOptions: { dot: true , ignore: ['**/.gitkeep', '**/.DS_Store', '**/Thumbs.db']} },
        { from: 'src/touch-icon-iphone.png', to: '../', globOptions: { dot: true } }
      ]
    })
  ],
  experiments: { topLevelAwait: true }
};
