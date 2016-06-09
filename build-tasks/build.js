import {join} from 'path';

import {create} from 'archiver';
import {copySync, createWriteStream, writeFileSync} from 'fs-extra';
import parseArgs from 'minimist';
import rimraf from 'rimraf';
import webpack from 'webpack';

const NO_OP = () => {
	// Called after app is built.
};
const buildDir = join(process.cwd(), 'build');
const distDir = join(buildDir, 'dist');

export function cleanDistAndBuildWAR(config) {
	// Remove the current `build` directory.
	rimraf(buildDir, rimrafCallback(config));
}

// When we've removed the previous `dist` directory build the application.
function rimrafCallback(config) {
	return () => webpack(
		config.webpackConfig,
		(error) => webpackBuildCallback(error, config)
	);
}

// When we've built the application copy any missing WAR files.
function webpackBuildCallback(error, {buildCallback = NO_OP, indexPage, warName}) {
	if (error) {
		console.error(error); // eslint-disable-line
	} else {
		const variant = parseArgs(process.argv.slice(2)).variant;
		const version = process.env.npm_package_version; // eslint-disable-line
		const indexFile = indexPage({variant, version});

		copySync(join(process.cwd(), 'scripts', 'WEB-INF'), join(distDir, 'WEB-INF'));
		copySync(join(process.cwd(), 'public'), join(distDir, 'public'));
		writeFileSync(join(distDir, 'index.html'), indexFile, 'utf8');
		buildCallback();

		const archive = create('zip');
		const warWriteStream = createWriteStream(join(buildDir, `${warName}.war`));

		archive.directory(distDir, '');
		archive.pipe(warWriteStream);
		archive.finalize();
	}
}
