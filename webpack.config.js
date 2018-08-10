const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: "./app/index.js",
        scripts: "./app/scripts/index.js",
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: 'html-loader!./app/index.html'
        }),
        new HtmlWebpackPlugin({
            template: 'html-loader!./app/views/main.html',
            filename: 'views/main.html'
        }),
        new HtmlWebpackPlugin({
            template: 'html-loader!./app/views/report.html',
            filename: 'views/report.html'
        }),
        new HtmlWebpackPlugin({
            template: 'html-loader!./app/views/result.html',
            filename: 'views/result.html'
        }),
        new HtmlWebpackPlugin({
            template: 'html-loader!./app/views/info.html',
            filename: 'views/info.html'
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    resolve: {
        alias: {
            leaflet_css: __dirname + "/node_modules/leaflet/dist/leaflet.css",
            leaflet_marker: __dirname + "/node_modules/leaflet/dist/images/marker-icon.png",
            leaflet_marker_2x: __dirname + "/node_modules/leaflet/dist/images/marker-icon-2x.png",
            leaflet_marker_shadow: __dirname + "/node_modules/leaflet/dist/images/marker-shadow.png"
        }
    },
    devtool: 'eval-source-map',
    output: {
        path: __dirname + "/dist/",
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "url-loader?limit=10000&mimetype=application/font-woff" 
            },
            {
                test: /\.(eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
};