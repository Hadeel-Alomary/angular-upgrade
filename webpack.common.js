const merge = require('webpack-merge');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');
const {NoEmitOnErrorsPlugin, NamedModulesPlugin, DefinePlugin, IgnorePlugin} = require('webpack');
const ScriptsWebpackPlugin = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/webpack').ScriptsWebpackPlugin;

const bundledCssFiles = [
  path.join(process.cwd(), "src\\static-libraries\\vendor\\slick\\css\\smoothness\\jquery-ui-1.8.16.custom.css"),
  path.join(process.cwd(), "src\\static-libraries\\vendor\\slick\\slick.grid.css"),
  path.join(process.cwd(), "src\\static-libraries\\vendor\\chart\\css\\bootstrap-datetimepicker.min.css"),
  path.join(process.cwd(), "src\\static-libraries\\vendor\\chart\\css\\bootstrap-select.min.css"),
  path.join(process.cwd(), "src\\static-libraries\\vendor\\chart\\css\\scxNumericField.min.css"),
  path.join(process.cwd(), "src\\static-libraries\\vendor\\chart\\css\\spectrum.min.css"),
  path.join(process.cwd(), "src\\styles.scss"),
];

const bundledJsFiles = [
  "./src\\static-libraries\\vendor\\slick\\lib\\jquery-1.7.min.js",
  "./src\\static-libraries\\vendor\\slick\\lib\\jquery-ui-1.8.16.custom.min.js",
  "./src\\static-libraries\\vendor\\slick\\lib\\jquery.event.drag-2.2.js",
  "./src\\static-libraries\\vendor\\perfect-scrollbar\\perfect-scrollbar.js",
  "./src\\static-libraries\\vendor\\slick\\slick.core.js",
  "./src\\static-libraries\\vendor\\slick\\slick.grid.js",
  "./src\\static-libraries\\vendor\\slick\\slick.dataview.js",
  "./src\\static-libraries\\vendor\\slick\\plugins\\slick.rowselectionmodel.js",
  "./src\\static-libraries\\vendor\\slick\\plugins\\slick.autocolumnsize.js",
  "./src\\static-libraries\\vendor\\chart\\scripts\\cdn\\jquery.min.js",
  "./src\\static-libraries\\vendor\\chart\\scripts\\cdn\\bootstrap.min.js",
  "./src\\static-libraries\\vendor\\chart\\scripts\\jquery-ui.min.js",
  "./src\\static-libraries\\vendor\\chart\\scripts\\moment.min.js",
  "./src\\static-libraries\\vendor\\chart\\scripts\\html2canvas.min.js",
  "./src\\static-libraries\\vendor\\chart\\scripts\\switchery.js",
  "./src\\static-libraries\\vendor\\chart\\scripts\\bootstrap-select.js",
  "./src\\static-libraries\\vendor\\chart\\scripts\\spectrum.js",
  "./src\\static-libraries\\vendor\\chart\\scripts\\bootstrap-datetimepicker.min.js",
  "./src\\static-libraries\\vendor\\base64\\base64.js",
  "./src\\static-libraries\\vendor\\prng4\\prng4.js",
  "./src\\static-libraries\\vendor\\rng\\rng.js",
  "./src\\static-libraries\\vendor\\rsa\\rsa.js",
  "./src\\static-libraries\\vendor\\jsbn\\jsbn.js",
  "./src\\static-libraries\\vendor\\jsencrypt\\jsencrypt.js"
];

// -------------------------------------------------------------------------
// MA to get html-loader working with angular:
// https://coderwall.com/p/rrhcag/using-webpack-html-loader-with-angular2
// -------------------------------------------------------------------------

module.exports = {
    "resolve": {
        "extensions": [
            ".ts",
            ".js"
        ],
        "modules": [
            "./node_modules"
        ],
        "symlinks": true,
        "alias": merge(
            rxPaths(),
            {
                "img": path.join(process.cwd(), "src/static/img/"),
                "font": path.join(process.cwd(), "src/static/font/")
            }
        ),
        "mainFields": [
            "browser",
            "module",
            "main"
        ]
    },
    "resolveLoader": {
        "modules": [
            "./node_modules"
        ],
        "alias": rxPaths()
    },
    "entry": {
        "main": [
            "./src\\main.ts"
        ],
        "polyfills": [
            "./src\\polyfills.ts"
        ],
        "styles": bundledCssFiles
    },
    "module": {
        "rules": [
            {
                "test": /\.html$/,
                "loader": "html-loader",
                "options":{
                    minimize: true,
                    removeAttributeQuotes: false,
                    caseSensitive: true,
                    customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
                    customAttrAssign: [ /\)?\]?=/ ]
                }
            },
            {
                "test": /\.(ttf|woff|woff2|eot|svg)$/,
                "loader": "file-loader",
                "options": {
                    "name": "[name].[ext]",
                    "limit": 10000,
                    "outputPath": "../static/font/",
                    "publicPath": "/app/static/font/"
                }
            },
            {
                "test": /\.(jpg|png|webp|gif|otf|ani|ico|cur)$/,
                "loader": "url-loader",
                "options": {
                    "name": "[name].[hash:7].[ext]",
                    "limit": 10000,
                    "outputPath": "../static/img/",
                    "publicPath": "/app/static/img/"
                }
            },
            {
                "exclude": bundledCssFiles,
                "test": /\.css$/,
                "use": [
                    "exports-loader?module.exports.toString()",
                    {
                        "loader": "css-loader",
                        "options": {
                            "sourceMap": false,
                            "import": false
                        }
                    }
                ]
            },
            {
                "include": bundledCssFiles,
                "test": /\.css$/,
                "use": [
                    "style-loader",
                    {
                        "loader": "css-loader",
                        "options": {
                            "sourceMap": false,
                            "import": false
                        }
                    }
                ]
            },
            {
                "include": bundledCssFiles,
                "test": /\.scss$|\.sass$/,
                "use": [
                    "style-loader",
                    {
                        "loader": "css-loader",
                        "options": {
                            "sourceMap": false,
                            "import": true
                        }
                    },
                    {
                        "loader": "sass-loader",
                        "options": {
                            "sourceMap": false,
                            "precision": 8,
                            "includePaths": []
                        }
                    }
                ]
            },
            {
                "test": /(\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                "loader": "@ngtools/webpack"
            }
        ]
    },
    "plugins": [
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': process.env.NODE_ENV
            }
        }),
        new IgnorePlugin(/^\.\/locale$/, /moment$/),
        new NoEmitOnErrorsPlugin(),
        new ScriptsWebpackPlugin({
            "name": "scripts",
            "sourceMap": false,
            "filename": "scripts.[hash].bundle.js",
            "scripts": bundledJsFiles,
            "basePath": "../webapp"
        }),
        new CopyWebpackPlugin([
            {
                "context": "src",
                "to": "../",
                "from": {
                    "glob": "assets\\**\\*",
                    "dot": true
                }
            },
            {
                "context": "src",
                "to": "../",
                "from": {
                    "glob": "touch-icon-iphone.png",
                    "dot": true
                }
            },
            {
                "context": "src",
                "to": "../",
                "from": {
                    "glob": "static\\vendor\\**\\*",
                    "dot": true
                }
            }
        ], {
            "ignore": [
                ".gitkeep",
                "**/.DS_Store",
                "**/Thumbs.db"
            ],
            "debug": "warning"
        }),
        new NamedModulesPlugin({})
    ],
    "node": {
        "fs": "empty",
        "global": true,
        "crypto": "empty",
        "tls": "empty",
        "net": "empty",
        "process": true,
        "module": false,
        "clearImmediate": false,
        "setImmediate": false
    }
};
