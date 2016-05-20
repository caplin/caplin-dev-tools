'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.cleanDistAndBuildWAR = cleanDistAndBuildWAR;

var _path = require('path');

var _archiver = require('archiver');

var _fsExtra = require('fs-extra');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var distDir = (0, _path.join)(process.cwd(), 'dist');
var indexPage = '';
var warName = '';
var webpackConfig = {};

function cleanDistAndBuildWAR(config) {
	indexPage = config.indexPage;
	warName = config.warName || 'app';
	webpackConfig = config.webpackConfig;
	// Remove the current `dist` directory.
	(0, _rimraf2.default)(distDir, rimrafCallback);
}

// When we've removed the previous `dist` directory build the application.
function rimrafCallback() {
	(0, _webpack2.default)(webpackConfig, webpackBuildCallback);
}

// When we've built the application copy any missing WAR files.
function webpackBuildCallback(error) {
	if (error) {
		console.error(error); // eslint-disable-line
	} else {
			var variant = (0, _minimist2.default)(process.argv.slice(2)).variant;
			var version = process.env.npm_package_version; // eslint-disable-line
			var indexFile = indexPage({ variant: variant, version: version });

			(0, _fsExtra.copySync)((0, _path.join)(process.cwd(), 'config', 'WEB-INF'), (0, _path.join)(distDir, 'WEB-INF'));
			(0, _fsExtra.copySync)((0, _path.join)(process.cwd(), 'public'), (0, _path.join)(distDir, 'public'));
			(0, _fsExtra.copySync)((0, _path.join)(process.cwd(), 'v'), (0, _path.join)(distDir, 'v'));
			(0, _fsExtra.copySync)((0, _path.join)(process.cwd(), 'v/dev/unbundled-resources'), (0, _path.join)(distDir, 'unbundled-resources'));
			(0, _fsExtra.writeFileSync)((0, _path.join)(distDir, 'index.html'), indexFile, 'utf8');

			var archive = (0, _archiver.create)('zip');
			var warWriteStream = (0, _fsExtra.createWriteStream)(warName + '.war');

			archive.directory(distDir, '');
			archive.pipe(warWriteStream);
			archive.finalize();
		}
}

