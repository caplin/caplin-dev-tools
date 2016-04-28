import {join} from 'path';

import {move} from 'fs-extra';

export function moveApplicationPackagesToLibs({applicationName, packagesThatShouldBeLibs, packagesDir}) {
	const convertedAppDir = join('apps', applicationName);

	for (const packageThatIsLib of packagesThatShouldBeLibs) {
		move(
			join(packagesDir, packageThatIsLib),
			join(convertedAppDir, 'src', packageThatIsLib),
			(err) => {
				if (err) {
					console.error(err); // eslint-disable-line
				}
			}
		);
	}
}
