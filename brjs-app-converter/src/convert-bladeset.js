import {join} from 'path';

import {copySync, readdirSync, removeSync} from 'fs-extra';

import {moveBladeCodeToPackages} from './convert-blade';
import {createNamespaceDirectoriesIfMissing} from './converter-utils';

// Find all blades in a bladeset, move and convert them to packages.
function moveAndConvertBladesCode(bladesetDir, bladesetName, conversionMetadata) {
	const bladesetBladesDir = join(bladesetDir, 'blades');
	const moveBladesPromises = readdirSync(bladesetBladesDir)
		.map((bladeName) => {
			conversionMetadata.packagesThatShouldBeLibs.push(bladeName);

			return moveBladeCodeToPackages(bladeName, bladesetName, bladesetBladesDir, conversionMetadata);
		});

	return Promise.all(moveBladesPromises);
}

// Given a bladeset move all the bladeset code and blades into the packages directory.
export function moveBladesetCode(conversionMetadata, bladesetDirName) {
	const {
		applicationName, applicationNamespaceRoot, brjsApplicationDir, packagesDir, packagesThatShouldBeLibs
	} = conversionMetadata;
	const bladesetDir = join(brjsApplicationDir, bladesetDirName);
	const bladesetName = bladesetDirName.replace('-bladeset', '');
	const packageName = `${applicationName}-${bladesetName}`;
	const bladesetPackageDir = join(packagesDir, packageName);
	const bladesetNamespacedDir = join(bladesetPackageDir, 'src', applicationNamespaceRoot, bladesetName);
	const bladesetDirContents = readdirSync(bladesetDir);
	const convertedBlades = moveAndConvertBladesCode(bladesetDir, bladesetName, conversionMetadata);

	copySync(bladesetDir, bladesetPackageDir);
	packagesThatShouldBeLibs.push(packageName);

	const createdNamespace = createNamespaceDirectoriesIfMissing(bladesetNamespacedDir, bladesetPackageDir);

	// The blades have already been extracted as stand alone packages, we don't want
	// them duplicated inside the bladeset.
	if (bladesetDirContents.includes('blades')) {
		removeSync(join(bladesetPackageDir, 'blades'));
	}

	return Promise.all([convertedBlades, createdNamespace]);
}
