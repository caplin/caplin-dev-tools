import {join, sep} from 'path';

import {copySync} from 'fs-extra';

import {createNamespaceDirectoriesIfMissing} from './converter-utils';

function createBladeNamespaceDirectoriesIfMissing(bladesetBladesDir, bladeName, bladePackageDir) {
	const [, , applicationName, suffixedBladesetName] = bladesetBladesDir.split(sep);
	const bladesetName = suffixedBladesetName.replace('-bladeset', '');
	const bladeNamespaceDir = join(bladePackageDir, 'src', applicationName, bladesetName, bladeName);

	return createNamespaceDirectoriesIfMissing(bladeNamespaceDir, bladePackageDir);
}

// Move a blade to the packages directory and convert it to an npm package.
export function moveBladeCodeToPackages(bladesetBladesDir, bladeName, packagesDir) {
	const bladeDir = join(bladesetBladesDir, bladeName);
	const bladePackageDir = join(packagesDir, bladeName);

	copySync(bladeDir, bladePackageDir);

	return createBladeNamespaceDirectoriesIfMissing(bladesetBladesDir, bladeName, bladePackageDir);
}
