const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
            template: 'html-loader!./app/404.html',
            filename: '404.html'
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
        }),
        //new BundleAnalyzerPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [
            new UglifyJsPlugin({parallel: true})
        ]
    },
    resolve: {
        alias: {
            leaflet_css: __dirname + "/node_modules/leaflet/dist/leaflet.css",
            leaflet_marker: __dirname + "/node_modules/leaflet/dist/images/marker-icon.png",
            leaflet_marker_2x: __dirname + "/node_modules/leaflet/dist/images/marker-icon-2x.png",
            leaflet_marker_shadow: __dirname + "/node_modules/leaflet/dist/images/marker-shadow.png",
        }
    },
    //devtool: 'eval-source-map',
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
                loader: 'file-loader'
            },
            {
                test: /\.(txt|ico)$/,
                loader: 'file-loader?name=[name].[ext]'
            },
            {
                test: /CNAME$/,
                loader: 'file-loader?name=[name]'
            },
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "url-loader?limit=10000&mimetype=application/font-woff" 
            },
            {
                test: /\.(eot|ttf|otf)$/,
                loader: 'file-loader'
            }
        ]
    }
};