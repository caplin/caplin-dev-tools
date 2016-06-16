import {
	join
} from 'path';

import {
	copySync,
	readdirSync,
	readJsonSync,
	statSync,
	writeJsonSync
} from 'fs-extra';

import {
	templateDir
} from './converter-data';

function setUpApplicationFiles(applicationName, convertedAppDir, conversionMetadata, defaultAspectDir) {
	copySync(join('..', 'conversion-data', applicationName), join(convertedAppDir));

	copySync(join(templateDir, '.babelrc'), join(convertedAppDir, '.babelrc'));
	copySync(conversionMetadata.privateKeyFileLocation, join(convertedAppDir, 'server', 'privatekey.pem'));
	copySync(join(defaultAspectDir, 'unbundled-resources'), join(convertedAppDir, 'public/dev/unbundled-resources'));
	copySync(join(defaultAspectDir, 'unbundled-resources'), join(convertedAppDir, 'public/dev'));
	copySync(join(conversionMetadata.brjsApplicationDir, 'WEB-INF'), join(convertedAppDir, 'scripts', 'WEB-INF'));
}

// Given an application populate its `package.json` with all the newly created packages as dependencies.
function populateApplicationPackageJSON(
	applicationName, convertedAppDir, {packagesDir, packagesDirName, packagesThatShouldBeLibs}
) {
	const appDependencies = {};
	const appPackageJSON = readJsonSync(join('..', 'conversion-data', applicationName, 'package.json'));
	const appPackageJSONFileLocation = join(convertedAppDir, 'package.json');

	for (const packageDir of readdirSync(packagesDir)) {
		const isNotLib = packagesThatShouldBeLibs.includes(packageDir) === false;
		const isDirectory = statSync(join(packagesDir, packageDir)).isDirectory();

		if (isNotLib && isDirectory) {
			appDependencies[packageDir] = `../../${packagesDirName}/${packageDir}`;
		}
	}

	appPackageJSON.dependencies = appDependencies;
	writeJsonSync(appPackageJSONFileLocation, appPackageJSON, {spaces: 2});
}

// Create application variant
function createApplication(applicationName, conversionMetadata, defaultAspectDir) {
	const convertedAppDir = join('apps', applicationName);

	setUpApplicationFiles(applicationName, convertedAppDir, conversionMetadata, defaultAspectDir);
	populateApplicationPackageJSON(applicationName, convertedAppDir, conversionMetadata);
}

// Create application and application variants directories.
export function createApplicationAndVariants(conversionMetadata) {
	const {applicationName, packagesDir} = conversionMetadata;
	const defaultAspectDir = join(packagesDir, `${applicationName}-default-aspect`);

	createApplication(applicationName, conversionMetadata, defaultAspectDir);
}
