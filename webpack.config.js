const webpack = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  return {
    entry: {
      app: "./app/index.js"
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "html-loader!./app/index.html",
      }),
      new HtmlWebpackPlugin({
        template: "html-loader!./app/index.html",
        filename: "404.html",
      }),
      new HtmlWebpackPlugin({
        template: "html-loader!./app/views/main.html",
        filename: "views/main.html",
      }),
      new HtmlWebpackPlugin({
        template: "html-loader!./app/views/report.html",
        filename: "views/report.html",
      }),
      new HtmlWebpackPlugin({
        template: "html-loader!./app/views/result.html",
        filename: "views/result.html",
      }),
      new HtmlWebpackPlugin({
        template: "html-loader!./app/views/info.html",
        filename: "views/info.html",
      }),
      new HtmlWebpackPlugin({
        template: "html-loader!./app/views/info-chch.html",
        filename: "views/info-chch.html",
      })
    ],
    optimization: argv.mode === 'production'
      ? {
          splitChunks: {
            chunks: "all",
          },
          minimize: true,
          minimizer: [
            new TerserPlugin({
              test: /\.js(\?.*)?$/i,
            }),
          ],
        }
      : {},
    resolve: {
      modules: [
        "node_modules", // The default
        "src",
      ]
    },
    devtool: argv.mode === 'development' ? "source-map" : false,
    devServer: {
      static: [path.join(__dirname, "dist")],
      compress: false,
      port: 9001,
      historyApiFallback: true,
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].[chunkhash].bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: [/\.jpg$/, /\.png$/, /\.gif$/],
          type: "asset/resource",
        },
        {
          test: /\.(txt|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]"
          }
        },
        {
          test: /CNAME$/,
          type: "asset/resource",
          generator: {
            filename: "[name]",
          },
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          type: "asset/inline",
        },
        {
          test: /\.(eot|ttf|otf)$/,
          type: "asset/resource",
        },
      ],
    },
  };
};
