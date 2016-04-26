import {join} from 'path';

import {
	readdirSync,
	copySync
} from 'fs-extra';

import {
	convertBRLibToPackage,
	convertLibToPackage,
	createBRLibPackageJSON
} from './convert-lib';
import {convertThirdpartyLibraryToPackage} from './convert-thirdparty-lib';

export function convertLib(packageDir, packageName) {
	const packageContentsFileNames = readdirSync(packageDir);

	if (packageContentsFileNames.includes('thirdparty-lib.manifest')) {
		convertThirdpartyLibraryToPackage(packageDir, packageName);
	} else if (packageContentsFileNames.includes('br-lib.conf') && packageContentsFileNames.includes('src')) {
		return convertBRLibToPackage(packageDir, packageName);
	} else if (packageContentsFileNames.includes('src')) {
		return convertLibToPackage(packageDir, packageName);
	} else {
		createBRLibPackageJSON(packageDir, packageName);
	}

	return Promise.resolve();
}

// Move BRJS application's libs to packages directory and convert them to something webpack can load.
export function createPackagesFromLibs({applicationLibsDir, packagesDir}) {
	// Firstly create a packages directory with all the application's `libs`.
	copySync(applicationLibsDir, packagesDir);

	const convertLibsPromises = readdirSync(packagesDir).map((packageName) => {
		const packageDir = join(packagesDir, packageName);

		return convertLib(packageDir, packageName);
	});

	return Promise.all(convertLibsPromises);
}
