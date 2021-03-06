const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => ({
	entry: "./src/main.jsx",
	output: {publicPath: "/dist/"},
	mode: env.prod ? "production" : "development",
	devtool: env.prod === "prod" ? "" : "eval-cheap-module-source-map",
	devServer: {open: true, publicPath: "/dist", port: 12345},
	plugins: [new MiniCssExtractPlugin({filename: "styles.css"})],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader", options: {
							modules: {
								exportLocalsConvention: "camelCaseOnly",
								localIdentName: "[name]__[local]--[hash:base64:5]",
							},
						},
					},
				],
			}, {
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: "babel-loader",
			}, {
				test: /\.(cpp|h|txt)$/,
				use: "raw-loader",
			}, {
				test: /\.md$/,
				use: [
					"raw-loader",
					"markdownit-loader",
				],
			},
		],
	},
	resolve: {extensions: [".js", ".jsx", ".json", ".css", ".svg"]},
});
