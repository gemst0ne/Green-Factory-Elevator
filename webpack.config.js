const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => {
	const config = {
		entry: {
			app: ['./src/index.js']
		},
		output: {
			filename: '[name].bundle.js',
			path: path.join(__dirname, '/public/dist')
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all'
					}
				}
			}
		},
		module: {
			rules: [
				{
					test: /\.(html)$/,
					use: {
						loader: 'html-loader',
						options: {
							attrs: [':data-src']
						}
					}
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: 'style-loader',
							options: {
								insertAt: 'top',
								singleton: true,
							}
						},
						{loader: 'css-loader'}
					],
				}
			]
		},


	};

	if(options.mode === 'development') {
		config.plugins = [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.ProvidePlugin({$: 'jquery', _: 'underscore'}),
			new HtmlWebpackPlugin({
				template: path.join(__dirname, 'index.html'),
				inject: true,
				filename: path.join(__dirname, '/public/dist/index.html')
			}),
		];
		config.devServer = {
			hot: true,
      port: 8080,
			contentBase: path.join(__dirname, '/public/dist'),
			stats: {
				color: true
			}
		};
	} else {
		config.plugins = [
			new CleanWebpackPlugin(),
			new webpack.ProvidePlugin({$: 'jquery', _: 'underscore'}),
		];
	}

	return config;
}