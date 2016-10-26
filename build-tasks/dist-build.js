'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.warDir = exports.distDir = exports.buildDir = undefined;
exports.deleteBuildDir = deleteBuildDir;
exports.cleanDistAndBuildWAR = cleanDistAndBuildWAR;

var _path = require('path');

var _archiver = require('archiver');

var _fs = require('fs');

var _fsExtra = require('fs-extra');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NO_OP = () => {
	// Called after app is built.
};

const buildDir = exports.buildDir = 'build';
const distDir = exports.distDir = (0, _path.join)(buildDir, 'dist');
const warDir = exports.warDir = (0, _path.join)(buildDir, 'exported-wars');

function deleteBuildDir(callback) {
	(0, _rimraf2.default)(buildDir, callback);
}

function cleanDistAndBuildWAR(config) {
	// Remove the current `build/dist` directory.
	(0, _rimraf2.default)(distDir, rimrafCallback(config));
}

// When we've removed the previous `dist` directory build the application.
function rimrafCallback(config) {
	return () => (0, _webpack2.default)(config.webpackConfig, error => webpackBuildCallback(error, config));
}

// When we've built the application copy any missing WAR files.
function webpackBuildCallback(error, {
	buildCallback = NO_OP, indexPage, version, warName, webInfLocation = (0, _path.join)(process.cwd(), 'scripts', 'WEB-INF')
}) {
	if (error) {
		console.error(error); // eslint-disable-line
	} else {
		const variant = (0, _minimist2.default)(process.argv.slice(2)).variant;
		const indexFile = indexPage({ variant, version });

		try {
			(0, _fsExtra.copySync)((0, _path.join)(process.cwd(), 'public', 'dev'), (0, _path.join)(distDir, 'public', version));
		} catch (err) {
			// Certain apps bundle all their static assets.
		}

		(0, _fsExtra.copySync)(webInfLocation, (0, _path.join)(distDir, 'WEB-INF'));

		(0, _fsExtra.writeFileSync)((0, _path.join)(distDir, 'index.html'), indexFile, 'utf8');
		// Allows the user of this package to attach their own post build/pre WAR creation script.
		buildCallback({ version });

		(0, _fs.mkdir)(warDir, () => {
			const archive = (0, _archiver.create)('zip');
			const versionedWARName = `${ warName }-${ version }.war`;
			const warWriteStream = (0, _fsExtra.createWriteStream)((0, _path.join)(warDir, versionedWARName));

			archive.directory(distDir, '');
			archive.pipe(warWriteStream);
			archive.finalize();
		});
	}
}

