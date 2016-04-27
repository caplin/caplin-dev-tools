import {join} from 'path';

import {copySync} from 'fs-extra';

// Move the application aspect code into the `pkgs` directory.
export function moveAspectCode(
	{applicationName, brjsApplicationDir, packagesDir, packagesThatShouldBeLibs}, aspectName
) {
	const packageName = `${applicationName}-${aspectName}`;
	const aspectPackageDir = join(packagesDir, packageName);

	copySync(join(brjsApplicationDir, aspectName), aspectPackageDir);
	packagesThatShouldBeLibs.push(packageName);
}
