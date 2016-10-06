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

export const buildDir = join(process.cwd(), 'build');
export const distDir = join(buildDir, 'dist');
export const warDir = join(buildDir, 'exported-wars');

export function deleteBuildDir(callback) {
	rimraf(buildDir, callback);
}

export function cleanDistAndBuildWAR(config) {
	// Remove the current `build/dist` directory.
	rimraf(distDir, rimrafCallback(config));
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
			copySync(join(process.cwd(), 'public', 'dev'), join(distDir, 'public', version));
		} catch (err) {
			// Certain apps bundle all their static assets.
		}

		copySync(join(process.cwd(), 'scripts', 'WEB-INF'), join(distDir, 'WEB-INF'));

		writeFileSync(join(distDir, 'index.html'), indexFile, 'utf8');
		// Allows the user of this package to attach their own post build/pre WAR creation script.
		buildCallback({version});

		mkdir(
			warDir,
			() => {
				const archive = create('zip');
				const versionedWARName = `${warName}-${version}.war`;
				const warWriteStream = createWriteStream(join(warDir, versionedWARName));

				archive.directory(distDir, '');
				archive.pipe(warWriteStream);
				archive.finalize();
			}
		);
	}
}
