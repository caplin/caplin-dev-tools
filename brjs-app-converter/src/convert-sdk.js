import {join} from 'path';

import {
	copySync,
	readdirSync
} from 'fs-extra';
import {convertLib} from './convert-libs';

// Copy all SDK libs to packages and convert them to npm packages.
export function convertSDKToPackages({packagesDir, sdkJSLibrariesDir}) {
	const packagesContentsFileNames = readdirSync(packagesDir);

	// We don't want to copy over packages that have name clashes because those packages came from the
	// application and BRJS would chose them over the SDK ones when bundling.
	return Promise.all(readdirSync(sdkJSLibrariesDir).map(packageName => {
		if (packagesContentsFileNames.includes(packageName)) {
			console.log(`Skipping conversion of '${packageName}' as the package already exists`); //eslint-disable-line
			return Promise.resolve();
		} else {
			const packageDir = join(packagesDir, packageName);

			copySync(join(sdkJSLibrariesDir, packageName), packageDir);
			try {
				return convertLib(packageDir, packageName);
			} catch (e) {
				// Ignore error, if we don't try and catch for it, the promise will not proceed due to an IO error
			}
		}
	}));
}
