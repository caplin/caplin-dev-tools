import {
	join
} from 'path';

import {
	move
} from 'fs-extra';

export function moveApplicationPackagesToLibs({applicationName, packagesThatShouldBeLibs, packagesDir}) {
	const convertedAppDir = join('apps', applicationName);

	const movePromises = packagesThatShouldBeLibs
		.map((packageThatIsLib) => {
			return new Promise((resolve, reject) => {
				move(
					join(packagesDir, packageThatIsLib),
					join(convertedAppDir, 'src', packageThatIsLib),
					(err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					}
				);
			});
		});

	return Promise.all(movePromises);
}
