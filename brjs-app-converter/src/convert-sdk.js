import {join} from 'path';

import {
	copySync,
	readdirSync
} from 'fs-extra';

import {convertLib} from './convert-libs';

// Copy all SDK libs to packages and convert them to npm packages.
export function convertSDKToPackages({packagesDir, sdkJSLibrariesDir}) {
	const packagesContentsFileNames = readdirSync(packagesDir);
	const sdkConvertedPromises = readdirSync(sdkJSLibrariesDir)
		.map((packageName) => {
			// We don't want to copy over packages that have name clashes because those packages came from the
			// application and BRJS would chose them over the SDK ones when bundling.
			if (packagesContentsFileNames.includes(packageName)) {
				console.log(`Skipping conversion of '${packageName}' as the package already exists`); //eslint-disable-line
			} else {
				const packageDir = join(packagesDir, packageName);

				copySync(join(sdkJSLibrariesDir, packageName), packageDir);

				return convertLib(packageDir, packageName);
			}

			return Promise.resolve();
		});

	return Promise.all(sdkConvertedPromises);
}
