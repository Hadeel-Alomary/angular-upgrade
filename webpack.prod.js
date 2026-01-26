const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const fs = require('fs');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const HashedModuleIdsPlugin = require("webpack-hashed-module-id-plugin");
const {DefinePlugin, LoaderOptionsPlugin} = require('webpack');
const {AngularCompilerPlugin} = require('@ngtools/webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const {AggressiveMergingPlugin} = require('webpack').optimize;
const entryPoints = ["inline", "polyfills", "sw-register", "styles", "scripts", "vendor", "main"];
const {getOutputFolder, getLocaleFile, getCleanPlugin, getLocaleLang, getPublicPath} = require("./i18n-helper");

const getVersion = (env) => {
    let version = fs.readFileSync(path.join(process.cwd(), "version.txt"), 'utf8');
    if (env.locale === "en") {
        return JSON.stringify(version);
    }
    let versionAsArray = version.split('.');
    versionAsArray[versionAsArray.length - 1] = parseInt(versionAsArray[versionAsArray.length - 1]) + 1;
    version = versionAsArray.join('.');
    fs.writeFile(path.join(process.cwd(), "version.txt"), version, 'utf8', (error) => {
        if (error) {
            console.log("Webpack writing on the what is new file has failed");
        }
    });
    return JSON.stringify(version);
};

const getProductionConfig = env => {
    return merge(common, {
        "output": {
            "path": getOutputFolder(env, false),
            "filename": "[name].[chunkhash].bundle.js",
            "crossOriginLoading": false,
            "publicPath": getPublicPath(env)
        },
        "optimization": {
            splitChunks: {
                chunks: "all",
            },
            runtimeChunk: "single"
        },
        "plugins": [
            getCleanPlugin(env, false),
            new CleanWebpackPlugin(["dist/app/static"]),
            new DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
                _g_prod: true,
                _g_version: getVersion(env)
            }),
            // new BundleAnalyzerPlugin({
            //     "analyzerMode" : "static"
            // }),
            new HtmlWebpackPlugin({
                "template": "./src\\index.ejs",
                "filename": "./index.ejs",
                "hash": true,
                "inject": true,
                "compile": true,
                "favicon": false,
                "minify": false,
                "cache": true,
                "showErrors": true,
                "chunks": "all",
                "excludeChunks": [],
                "title": env.locale === "en" ? "TickerChart Net" : "تكرتشارت نت",
                "xhtml": true,
                "buildLanguage": env.locale,
                "redirectUrl": env.locale === "en" ? "/app/ar" : "/app/en",
                "scriptBundleUrl": env.locale === "en" ? "/app/en/scripts.bundle.js" : "/app/ar/scripts.bundle.js",
                "chunksSortMode": function sort(left, right) {
                    let leftIndex = entryPoints.indexOf(left.names[0]);
                    let rightindex = entryPoints.indexOf(right.names[0]);
                    if (leftIndex > rightindex) {
                        return 1;
                    }
                    else if (leftIndex < rightindex) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                }
            }),
            new AngularCompilerPlugin({
                "mainPath": "main.ts",
                "platform": 0,
                "hostReplacementPaths": {
                    "environments\\environment.ts": "environments\\environment.ts"
                },
                "sourceMap": false,
                "tsConfigPath": ".\\tsconfig.json",
                "skipCodeGeneration": false,
                "compilerOptions": {},
                "locale": getLocaleLang(env),
                "i18nInFile": getLocaleFile(env)
            }),
            new HashedModuleIdsPlugin(),
            new LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new AggressiveMergingPlugin(),
            new ReplaceInFileWebpackPlugin([{
                dir: getOutputFolder(env, false),
                files: ['index.ejs'],
                rules: [{
                    search: 'scripts.bundle.js',
                    replace: function (match) {
                        let files = fs.readdirSync(getOutputFolder(env, false));
                        for(let i = 0; i < files.length; i++) {
                            if(files[i].startsWith("scripts.") && files[i].endsWith(".bundle.js")) {
                                return files[i];
                            }
                        }
                        return match;
                    }
                }]
            }])
        ]
    });
};


module.exports = env => {
    return getProductionConfig(env);
};
