import {
	join
} from 'path';

import {
	create
} from 'archiver';
import {
	mkdir
} from 'fs';
import {
	copySync,
	createWriteStream,
	writeFileSync
} from 'fs-extra';
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
function webpackBuildCallback(error, {buildCallback = NO_OP, indexPage, version, warName}) {
	if (error) {
		console.error(error); // eslint-disable-line
	} else {
		const variant = parseArgs(process.argv.slice(2)).variant;
		const indexFile = indexPage({variant, version});

		try {
			copySync(join(process.cwd(), 'scripts', 'WEB-INF'), join(distDir, 'WEB-INF'));
			copySync(join(process.cwd(), 'public', 'dev'), join(distDir, 'public', version));	
		} catch (e) {
			// do nothing
		}

		writeFileSync(join(distDir, 'index.html'), indexFile, 'utf8');
		buildCallback();
		const archive = create('zip');

		mkdir(join(buildDir, 'exported-wars'), () => {
			const warWriteStream = createWriteStream(join(buildDir, 'exported-wars', `${warName}-${version}.war`));

			archive.directory(distDir, '');
			archive.pipe(warWriteStream);
			archive.finalize();
		});
	}
}
