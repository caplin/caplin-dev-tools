import {join} from 'path';

import {create} from 'archiver';
import {copySync, createWriteStream, writeFileSync} from 'fs-extra';
import parseArgs from 'minimist';
import rimraf from 'rimraf';
import webpack from 'webpack';

const distDir = join(process.cwd(), 'dist');
let indexPage = '';
let warName = '';
let webpackConfig = {};

export function cleanDistAndBuildWAR(config) {
	indexPage = config.indexPage;
	warName = config.warName || 'app';
	webpackConfig = config.webpackConfig;
	// Remove the current `dist` directory.
	rimraf(distDir, rimrafCallback);
}

// When we've removed the previous `dist` directory build the application.
function rimrafCallback() {
	webpack(webpackConfig, webpackBuildCallback);
}

// When we've built the application copy any missing WAR files.
function webpackBuildCallback(error) {
	if (error) {
		console.error(error); // eslint-disable-line
	} else {
		const variant = parseArgs(process.argv.slice(2)).variant;
		const version = process.env.npm_package_version; // eslint-disable-line
		const indexFile = indexPage({variant, version});

		copySync(join(process.cwd(), 'config', 'WEB-INF'), join(distDir, 'WEB-INF'));
		copySync(join(process.cwd(), 'public'), join(distDir, 'public'));
		copySync(join(process.cwd(), 'v'), join(distDir, 'v'));
		copySync(join(process.cwd(), 'v/dev/unbundled-resources'), join(distDir, 'unbundled-resources'));
		writeFileSync(join(distDir, 'index.html'), indexFile, 'utf8');

		const archive = create('zip');
		const warWriteStream = createWriteStream(`${warName}.war`);

		archive.directory(distDir, '');
		archive.pipe(warWriteStream);
		archive.finalize();
	}
}
