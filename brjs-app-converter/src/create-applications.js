import {join} from 'path';

import {
	copySync,
	mkdirsSync,
	readdirSync,
	writeFileSync,
	writeJsonSync
} from 'fs-extra';

import {
	compiledAppPackageJSONTemplate,
	templateDir
} from './converter-data';

function setUpApplicationFiles(convertedAppDir, conversionMetadata, defaulAspectDir) {
	copySync(join(templateDir, '.babelrc'), join(convertedAppDir, '.babelrc'));
	copySync(conversionMetadata.authenticationFileLocation, join(convertedAppDir, 'server', 'authentication.js'));
	copySync(join(templateDir, 'config'), join(convertedAppDir, 'config'));
	copySync(conversionMetadata.aliasesFileLocation, join(convertedAppDir, 'config', 'aliases.js'));
	copySync(join(templateDir, 'index.js'), join(convertedAppDir, 'index.js'));
	copySync(join('..', 'conversion-data', 'keymaster.js'), join(convertedAppDir, 'server', 'keymaster.js'));
	copySync(conversionMetadata.metadataFileLocation, join(convertedAppDir, 'config', 'metadata.js'));
	copySync(join(templateDir, 'server'), join(convertedAppDir, 'server'));
	copySync(conversionMetadata.authenticationFileLocation, join(convertedAppDir, 'server', 'authentication.js'));
	copySync(
		conversionMetadata.privateKeyFileLocation,
		join(convertedAppDir, 'server', 'privatekey.pem')
	);
	copySync(
		join(defaulAspectDir, 'unbundled-resources'),
		join(convertedAppDir, 'v/dev/unbundled-resources')
	);
	copySync(
		join(defaulAspectDir, 'unbundled-resources'),
		join(convertedAppDir, 'public')
	);
	copySync(join(conversionMetadata.brjsApplicationDir, 'WEB-INF'), join(convertedAppDir, 'config', 'WEB-INF'));
	writeFileSync(join(convertedAppDir, 'config', 'webpack.config.js'), conversionMetadata.webpackConfig);
}

// Given an application populate its `package.json` with all the newly created packages as dependencies.
function populateApplicationPackageJSON(
	applicationName, convertedAppDir, {packagesDir, packagesDirName, packagesThatShouldBeLibs}
) {
	const appDependencies = {};
	const appPackageJSON = JSON.parse(compiledAppPackageJSONTemplate({applicationName}));
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
	setUpApplicationFiles(convertedAppDir, conversionMetadata, defaulAspectDir);
	populateApplicationPackageJSON(applicationName, convertedAppDir, conversionMetadata);
}

// Create application and application variants directories.
export function createApplicationAndVariants(conversionMetadata) {
	const {applicationName, applicationVariants, packagesDir} = conversionMetadata;
	const defaulAspectDir = join(packagesDir, `${applicationName}-default-aspect`);

	createApplication(applicationName, conversionMetadata, defaulAspectDir);

	for (const appVariant of applicationVariants) {
		const appVariantName = `${applicationName}-${appVariant}`;

		createApplication(appVariantName, conversionMetadata, defaulAspectDir);
	}
}
