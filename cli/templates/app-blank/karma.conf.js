const { join } = require("path");

const createWebpackConfig = require("./webpack.config");
const webpackConfig = createWebpackConfig();

webpackConfig.resolve.alias["$aliases-data$"] = join(
  __dirname,
  "src/config/aliases-test.js"
);

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
		webpack: webpackConfig,
		plugins : [
			require("karma-mocha"),
			require("karma-webpack"),
			require("karma-chrome-launcher")
		]
	});
};