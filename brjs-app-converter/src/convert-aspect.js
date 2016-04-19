import {join} from 'path';

import {
	copySync,
	writeFileSync
} from 'fs-extra';

import {compiledBRLibPackageJSONTemplate} from './converter-data';

// Move the application aspect code into the `pkgs` directory.
export function moveAspectCode({applicationName, brjsApplicationDir, packagesDir}, aspectName) {
	const packageName = `${applicationName}-${aspectName}`;
	const aspectPackageDir = join(packagesDir, packageName);
	const packageJSON = compiledBRLibPackageJSONTemplate({packageName});

	copySync(join(brjsApplicationDir, aspectName), aspectPackageDir);
	writeFileSync(join(aspectPackageDir, 'package.json'), packageJSON);
}
