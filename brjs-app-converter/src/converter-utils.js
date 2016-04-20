import {join} from 'path';

import {
	accessSync,
	copy,
	mkdirsSync,
	readdirSync,
	readFileSync,
	remove,
	renameSync
} from 'fs-extra';
import partial from 'lodash/function/partial';

import {
	compiledWebpackConfigTemplate,
	templateDir
} from './converter-data';

// If a file is present in the `conversion-data` override directory read it else read the template version.
function readBoilerplateFile(conversionDataDirContents, fileName, compiledTemplate) {
	if (conversionDataDirContents.includes(fileName)) {
		return readFileSync(join('..', 'conversion-data', fileName));
	}

	return compiledTemplate;
}

// If a file is present in the `conversion-data` override directory use it else use the template version.
function getBoilerplateFileLocation(conversionDataDirContents, fileName, filePath = fileName) {
	if (conversionDataDirContents.includes(fileName)) {
		return join('..', 'conversion-data', filePath);
	}

	return join(templateDir, filePath);
}

// If a directory is present in the `conversion-data` override directory use it else use the template version.
function getBoilerplateDirLocation(backupDir, conversionDataDirContents, fileName, filePath) {
	if (conversionDataDirContents.includes(fileName)) {
		return join('..', 'conversion-data', filePath);
	}

	return join(backupDir, filePath);
}

// Return the contents of the `conversion-data` directory.
function getConversionDataDirContents() {
	const conversionDataDir = join('..', 'conversion-data');
	const parentDirContents = readdirSync('..');

	if (parentDirContents.includes('conversion-data')) {
		return readdirSync(conversionDataDir);
	}

	console.log("A conversion-data directory was not provided, using default data."); // eslint-disable-line

	return [];
}

// The user can provide a directory with files that override the boilerplate files what the conversion tool
// uses by default. We check for the existance of these overrides and use them if present.
function useConversionDataDirectoryFilesIfPresent(backupDir, entryModuleID, packagesDirName) {
	const compiledWebpackConfig = compiledWebpackConfigTemplate({packagesDirName});
	const conversionDataDirContents = getConversionDataDirContents();
	const getBoilerplateFileLocationPartial = partial(getBoilerplateFileLocation, conversionDataDirContents);
	const readBoilerplateFilePartial = partial(readBoilerplateFile, conversionDataDirContents);
	const sdkJSLibrariesDir = getBoilerplateDirLocation(
		backupDir, conversionDataDirContents, 'sdk', join('sdk', 'libs', 'javascript')
	);
	const privateKeyFileLocation = getBoilerplateDirLocation(
		backupDir, conversionDataDirContents, 'privatekey.pem', join('conf', 'keymaster', 'privatekey.pem')
	);

	return {
		aliasesFileLocation: getBoilerplateFileLocationPartial('aliases.js'),
		authenticationFileLocation: getBoilerplateFileLocationPartial('authentication.js'),
		metadataFileLocation: getBoilerplateFileLocationPartial('metadata.js'),
		privateKeyFileLocation,
		sdkJSLibrariesDir,
		webpackConfig: readBoilerplateFilePartial('webpack.config.js', compiledWebpackConfig)
	};
}

// Create all the metadata required for converting an app, directory locations etc.
export function createConversionMetadataDataType(applicationName, applicationVariants, entryModuleID) {
	// string: Directory that BRJS project is moved to.
	const backupDir = join('brjs-app');
	// string: Directory that BRJS application is moved to.
	const brjsApplicationDir = join(backupDir, 'apps', applicationName);
	// string: Name of packages directory.
	const packagesDirName = 'packages';
	const conversionData = useConversionDataDirectoryFilesIfPresent(
		backupDir, entryModuleID, packagesDirName
	);

	return {
		aliasesFileLocation: conversionData.aliasesFileLocation,
		authenticationFileLocation: conversionData.authenticationFileLocation,
		applicationName,
		// string: The BRJS application's `libs` directory
		applicationLibsDir: join(brjsApplicationDir, 'libs'),
		applicationVariants,
		backupDir,
		brjsApplicationDir,
		entryModule: conversionData.entryModule,
		metadataFileLocation: conversionData.metadataFileLocation,
		// string: Packages directory, where all `libs`, `blades` etc are moved to.
		packagesDir: join(packagesDirName),
		packagesDirName,
		privateKeyFileLocation: conversionData.privateKeyFileLocation,
		sdkJSLibrariesDir: conversionData.sdkJSLibrariesDir,
		webpackConfig: conversionData.webpackConfig
	};
}

// Certain libs/blades/bladesets don't have a complete namespaced directory structure inside them.
// This is something BRJS supports but bundlers like webpack don't, so we need to create these
// directories to allow them to load the required modules.
export function createNamespaceDirectoriesIfMissing(namespacedDir, packageDir) {
	try {
		accessSync(namespacedDir);
	} catch (namespacedDirectoryDoesNotExistError) {
		// We are either using BR's short directory feature, where the source is directly
		// inside a `src` directory, or there is no source code at all.
		const packageDirContents = readdirSync(packageDir);

		if (packageDirContents.includes('src')) {
			return new Promise((resolve, reject) => {
				const removeCallback = (removeError) => {
					if (removeError) {
						console.error(removeError); // eslint-disable-line
					}
					resolve();
				};
				const copyCallback = (copyError) => {
					if (copyError) {
						console.error(copyError); // eslint-disable-line
						resolve();
					} else {
						remove(join(packageDir, 'src-bck'), removeCallback);
					}
				};

				// webpack will need a complete namespaced directory structure to load modules.
				renameSync(join(packageDir, 'src'), join(packageDir, 'src-bck'));
				mkdirsSync(namespacedDir);
				// This nested async mess is required to work around errors in Windows, it doesn't
				// like renaming a directory that has just been created.
				copy(join(packageDir, 'src-bck'), namespacedDir, copyCallback);
			});
		}
	}
	return Promise.resolve();
}

// Put the current codebase in a new top level folder to clean up the project directory.
export function moveCurrentCodebase({backupDir}) {
	// Filter out hidden files, skips files like `.git`.
	const projectFiles = readdirSync('.')
		.filter((fileName) => !/^\./.test(fileName));

	mkdirsSync(backupDir);

	for (const fileName of projectFiles) {
		renameSync(fileName, join(backupDir, fileName));
	}
}

// Fail fast if some of the CLI arguments are missing.
export function verifyCLIArgs(applicationName, applicationEntryModule) {
	if (applicationName === undefined) {
		throw new Error('An application name must be provided.');
	} else if (applicationEntryModule === undefined) {
		throw new Error('An application entry module must be provided.');
	}
}
