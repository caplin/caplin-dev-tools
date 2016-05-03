module.exports = function(config) {
	config.set({
		files: [
			'./src/**/_test-ut/**/*.js'
		],
		browsers: ['Chrome'],
		frameworks: ['mocha'],
		preprocessors: {
			['./src/**/*.js']: ['webpack']
		},
		singleRun: true,
		webpackMiddleware: {
			stats: {
				assets: false,
				colors: true,
				chunks: false
			}
		},
		webpack: {
			devtool: 'inline-source-map',
			module: {
				loaders: [
					{
						exclude: /node_modules/,
						loader: 'babel-loader',
						test: /\.js?$/
					}
				]
			}
		},
		plugins : [
			require("karma-mocha"),
			require("karma-webpack"),
			require("karma-chrome-launcher")
		]
	});
};
