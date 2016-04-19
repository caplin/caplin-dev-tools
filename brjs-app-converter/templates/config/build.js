import {join} from 'path';

import {
	copySync,
	writeFileSync
} from 'fs-extra';
import parseArgs from 'minimist';
import rimraf from 'rimraf';
import webpack from 'webpack';

import indexPage from '../server/index-page.js';
import webpackConfig from '../webpack.config.js';

const distDir = join(__dirname, '../dist');

function webpackBuildCallback(error) {
	if (error) {
		console.error(error); // eslint-disable-line
	} else {
		const variant = parseArgs(process.argv.slice(2)).variant || 'caplin';
		const version = process.env.npm_package_version; // eslint-disable-line
		const indexFile = indexPage({variant, version});

		writeFileSync(join(distDir, 'index.html'), indexFile, 'utf8');
		copySync(join(__dirname, '../public'), join(distDir, 'public'));
		copySync(join(__dirname, '../v'), join(distDir, 'v'));
		copySync(join(__dirname, '../v/dev/unbundled-resources'), join(distDir, 'unbundled-resources'));
		copySync(join(__dirname, 'WEB-INF'), join(distDir, 'WEB-INF'));
	}
}

function rimrafCallback() {
	webpack(webpackConfig, webpackBuildCallback);
}

rimraf(distDir, rimrafCallback);
