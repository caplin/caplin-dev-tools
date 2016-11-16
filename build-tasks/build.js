const {
	join
} = require('path');

const {
	create
} = require('archiver');
const {
	mkdir
} = require('fs');
const {
	copySync,
	createWriteStream,
	writeFileSync
} = require('fs-extra');
const parseArgs = require('minimist');
const rimraf = require('rimraf');
const webpack = require('webpack');

const NO_OP = () => {
	// Called after app is built.
};

const buildDir = exports.buildDir = 'build';
const distDir = exports.distDir = join(buildDir, 'dist');
const warDir = exports.warDir = join(buildDir, 'exported-wars');

exports.deleteBuildDir = function deleteBuildDir(callback) {
	rimraf(buildDir, callback);
}

exports.cleanDistAndBuildWAR = function cleanDistAndBuildWAR(config) {
	// Remove the current `build/dist` directory.
	rimraf(distDir, rimrafCallback(config));
}

// When we've removed the previous `dist` directory build the application.
function rimrafCallback(config) {
	return () => webpack(
		config.webpackConfig,
		(error, stats) => webpackBuildCallback(error, stats, config)
	);
}

// When we've built the application copy any missing WAR files.
function webpackBuildCallback(error, stats, {
	buildCallback = NO_OP, indexPage, version, warName, webInfLocation = join(process.cwd(), 'scripts', 'WEB-INF')
}) {
	const jsonStats = stats.toJson();

	if (error) {
		console.error(error); // eslint-disable-line
	} else if (jsonStats.errors.length > 0) {
		jsonStats.errors.forEach((err) => console.error(err));
	} else {
		const variant = parseArgs(process.argv.slice(2)).variant;
		const indexFile = indexPage({variant, version});

		try {
			copySync(join(process.cwd(), 'public', 'dev'), join(distDir, 'public', version));
		} catch (err) {
			// Certain apps bundle all their static assets.
		}

		copySync(webInfLocation, join(distDir, 'WEB-INF'));

		writeFileSync(join(distDir, 'index.html'), indexFile, 'utf8');
		// Allows the user of this package to attach their own post build/pre WAR creation script.
		buildCallback({version});

		mkdir(
			warDir,
			() => {
				const archive = create('zip');
				const warWriteStream = createWriteStream(join(warDir, `${warName}.war`));

				archive.directory(distDir, '');
				archive.pipe(warWriteStream);
				archive.finalize();
			}
		);
	}
}
