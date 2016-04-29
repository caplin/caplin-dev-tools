import {join} from 'path';

import {
	copySync,
	mkdirsSync,
	readdirSync,
	readJsonSync,
	writeJsonSync
} from 'fs-extra';

import {templateDir} from './converter-data';

function setUpApplicationFiles(applicationName, convertedAppDir, conversionMetadata, defaulAspectDir) {
	copySync(join(templateDir, '.babelrc'), join(convertedAppDir, '.babelrc'));
	copySync(join('..', 'conversion-data', applicationName, 'config'), join(convertedAppDir, 'config'));
	copySync(join('..', 'conversion-data', applicationName, 'index.js'), join(convertedAppDir, 'index.js'));
	copySync(conversionMetadata.privateKeyFileLocation, join(convertedAppDir, 'server', 'privatekey.pem'));
	copySync(join('..', 'conversion-data', applicationName, 'server'), join(convertedAppDir, 'server'));
	copySync(join(defaulAspectDir, 'unbundled-resources'), join(convertedAppDir, 'v/dev/unbundled-resources'));
	copySync(join(defaulAspectDir, 'unbundled-resources'), join(convertedAppDir, 'public'));
	copySync(join(conversionMetadata.brjsApplicationDir, 'WEB-INF'), join(convertedAppDir, 'config', 'WEB-INF'));
}

// Given an application populate its `package.json` with all the newly created packages as dependencies.
function populateApplicationPackageJSON(
	applicationName, convertedAppDir, {packagesDir, packagesDirName, packagesThatShouldBeLibs}
) {
	const appDependencies = {};
	const appPackageJSON = readJsonSync(join('..', 'conversion-data', applicationName, 'package.json'));
	const appPackageJSONFileLocation = join(convertedAppDir, 'package.json');

	for (const packageDir of readdirSync(packagesDir)) {
		if (packagesThatShouldBeLibs.includes(packageDir) === false) {
			appDependencies[packageDir] = `../../${packagesDirName}/${packageDir}`;
		}
	}

	appPackageJSON.dependencies = appDependencies;
	writeJsonSync(appPackageJSONFileLocation, appPackageJSON, {spaces: 2});
}

// Create application variant
function createApplication(applicationName, conversionMetadata, defaulAspectDir) {
	const convertedAppDir = join('apps', applicationName);

	mkdirsSync(convertedAppDir);
	setUpApplicationFiles(applicationName, convertedAppDir, conversionMetadata, defaulAspectDir);
	populateApplicationPackageJSON(applicationName, convertedAppDir, conversionMetadata);
}

// Create application and application variants directories.
export function createApplicationAndVariants(conversionMetadata) {
	const {applicationName, packagesDir} = conversionMetadata;
	const defaulAspectDir = join(packagesDir, `${applicationName}-default-aspect`);

	createApplication(applicationName, conversionMetadata, defaulAspectDir);
}
