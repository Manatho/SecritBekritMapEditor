const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const cleanWebPackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
	entry: "./app/boot.js",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "../docs"),
		globalObject: "this"
	},
	mode: "development",
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist",
		hot: true
	},
	module: {
		rules: [
			{ test: /\.vue$/, include: /app/, loader: "vue-loader" },
			{ test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
			{ test: /\.(tfm|png|jp(e*)g|svg)$/, use: ["file-loader"] },
			{ test: /\.worker\.js$/, use: { loader: "worker-loader" } }
		]
	},
	plugins: [
		new cleanWebPackPlugin(["docs"], { root: path.resolve(__dirname, "..") }),
		new HtmlWebpackPlugin({ title: "App", template: "index.html" }),
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin()
	]
};
