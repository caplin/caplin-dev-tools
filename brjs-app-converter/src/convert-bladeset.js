import {join} from 'path';

import {
	copySync,
	readdirSync,
	removeSync,
	writeFileSync
} from 'fs-extra';

import {moveBladeCodeToPackages} from './convert-blade';
import {compiledBRLibPackageJSONTemplate} from './converter-data';
import {createNamespaceDirectoriesIfMissing} from './converter-utils';

// Find all blades in a bladeset, move and convert them to packages.
function moveAndConvertBladesCode(bladesetDir, packagesDir) {
	const bladesetBladesDir = join(bladesetDir, 'blades');
	const moveBladesPromises = readdirSync(bladesetBladesDir)
		.map((bladeName) => moveBladeCodeToPackages(bladesetBladesDir, bladeName, packagesDir));

	return Promise.all(moveBladesPromises);
}

// Given a bladeset move all the bladeset code and blades into the packages directory.
export function moveBladesetCode({applicationName, brjsApplicationDir, packagesDir}, bladesetDirName) {
	const bladesetDir = join(brjsApplicationDir, bladesetDirName);
	const bladesetName = bladesetDirName.replace('-bladeset', '');
	const packageName = `${applicationName}-${bladesetName}`;
	const bladesetPackageDir = join(packagesDir, packageName);
	const bladesetNamespacedDir = join(bladesetPackageDir, 'src', applicationName, bladesetName);
	const packageJSON = compiledBRLibPackageJSONTemplate({packageName});
	const bladesetDirContents = readdirSync(bladesetDir);
	const convertedBlades = moveAndConvertBladesCode(bladesetDir, packagesDir);

	copySync(bladesetDir, bladesetPackageDir);
	writeFileSync(join(bladesetPackageDir, 'package.json'), packageJSON);
	const createdNamespace = createNamespaceDirectoriesIfMissing(bladesetNamespacedDir, bladesetPackageDir);

	// The blades have already been extracted as stand alone packages, we don't want
	// them duplicated inside the bladeset.
	if (bladesetDirContents.includes('blades')) {
		removeSync(join(bladesetPackageDir, 'blades'));
	}

	return Promise.all([convertedBlades, createdNamespace]);
}
