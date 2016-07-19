import {
	join
} from 'path';

import {
	copySync,
	readdirSync,
	statSync
} from 'fs-extra';

import {
	convertBRLibToPackage,
	convertLibToPackage,
	createBRLibPackageJSON
} from './convert-lib';
import {convertThirdpartyLibraryToPackage} from './convert-thirdparty-lib';

export function convertLib(packageDir, packageName, createPackageJSON = true) {
	const packageContentsFileNames = readdirSync(packageDir);

	if (packageContentsFileNames.includes('thirdparty-lib.manifest')) {
		convertThirdpartyLibraryToPackage(packageDir, packageName, createPackageJSON);
	} else if (packageContentsFileNames.includes('br-lib.conf') && packageContentsFileNames.includes('src')) {
		return convertBRLibToPackage(packageDir, packageName, createPackageJSON);
	} else if (packageContentsFileNames.includes('src')) {
		return convertLibToPackage(packageDir, packageName, createPackageJSON);
	} else {
		createBRLibPackageJSON(packageDir, packageName, createPackageJSON);
	}

	return Promise.resolve();
}

// Move BRJS application's libs to packages directory and convert them to something webpack can load.
export function createPackagesFromLibs({applicationLibsDir, packagesDir}) {
	// Firstly create a packages directory with all the application's `libs`.
	copySync(applicationLibsDir, packagesDir);

	const convertLibsPromises = readdirSync(packagesDir)
		.map((fileName) => ({
			packageDir: join(packagesDir, fileName),
			packageName: fileName
		}))
		.filter(({packageDir}) => statSync(packageDir).isDirectory())
		.map(({packageDir, packageName}) => convertLib(packageDir, packageName));

	return Promise.all(convertLibsPromises);
}
