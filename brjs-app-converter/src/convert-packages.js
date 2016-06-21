import {
	dirname,
	relative
} from 'path';

import {
	copySync,
	lstatSync,
	readdirSync,
	readFileSync,
	writeFileSync
} from 'fs-extra';
import glob from 'glob';
import rimraf from 'rimraf';

function deleteUnusedFiles(packagePath) {
	rimraf.sync(`${packagePath}/resources`);
	rimraf.sync(`${packagePath}/test-unit`);
	rimraf.sync(`${packagePath}/test-acceptance`);
	rimraf.sync(`${packagePath}/compiled`);
	rimraf.sync(`${packagePath}/src`);
	rimraf.sync(`${packagePath}/br-lib.conf`);
	rimraf.sync(`${packagePath}/_resources/aliases.xml`);
	rimraf.sync(`${packagePath}/_resources/aliasDefinitions.xml`);
	rimraf.sync(`${packagePath}/_resources-test-ut/aliases.xml`);
	rimraf.sync(`${packagePath}/_resources-test-ut/aliasDefinitions.xml`);
	rimraf.sync(`${packagePath}/_resources-test-at/aliases.xml`);
	rimraf.sync(`${packagePath}/_resources-test-at/aliasDefinitions.xml`);
}

// Should this package use relative imports if importing an application level (in `src` directory) module.
function isPackageInApplication(packagePath, packagesDir, packagesThatShouldBeLibs) {
	// `packagePath` is in the format `packages/workbench` so remove `packages/`.
	const packageName = packagePath.replace(`${packagesDir}/`, '');

	return packagesThatShouldBeLibs.includes(packageName);
}

// importerPathName -> Path to file doing the importing e.g. 'apps/mobile/src/config/aliases.js'
// moduleSourceToPathNamePrefix -> Prefix that converts the module source into file path e.g. '/packages/'
// moduleSource -> Import statement module e.g. 'mobile-blotter/screens/orders/bulk_orders/BulkOrderStateManager'
export function createRelativeModuleSource(importerPathName, moduleSourceToPathNamePrefix, moduleSource) {
	// For `relative` to work it must be provided with absolute file paths.
	// So we convert the importer and imported file paths/module sources to absolute file paths.
	const absoluteImporterFileName = `/${importerPathName}`;
	const absoluteImportedFileName = moduleSourceToPathNamePrefix + moduleSource;
	const directoryOfImporterFile = dirname(absoluteImporterFileName);
	const relativeFilePathToImportedModule = relative(directoryOfImporterFile, absoluteImportedFileName);

	if (relativeFilePathToImportedModule.startsWith('.')) {
		return relativeFilePathToImportedModule;
	}

	// A file path to a child directory can start without `./` for file system operations but webpack and
	// ES Modules require `./` to distinguish relative imports from package requires so we must add it,
	// i.e. 'child_directory/File' is converted to './child_directory/File'.
	return `./${relativeFilePathToImportedModule}`;
}

function shouldModuleBeRelative(moduleSource, applicationPackages) {
	// The `moduleSource` is of the format `br-component/Component`.
	const packageOfImportedModule = moduleSource.split('/')[0];

	// Should the module import be relative.
	return applicationPackages.includes(packageOfImportedModule);
}

// Returns a function that checks if a given module source is for a module in the application `src` directory,
// if it is it will convert the module source to be relative.
function createModuleSourceProcessor(applicationPackages, moduleSourceToPathNamePrefix) {
	return (moduleSource, importerPathName) => {
		const isImportedModuleFromRelativePackage = shouldModuleBeRelative(moduleSource, applicationPackages);

		// Is the module you are importing located in the application's `src` directory.
		if (isImportedModuleFromRelativePackage) {
			return createRelativeModuleSource(importerPathName, moduleSourceToPathNamePrefix, moduleSource);
		}

		return moduleSource;
	};
}

// Returns a function that updates all the import module sources to their new values and makes application `src` to
// application `src` imports relative.
function createPackageImportsUpdater(packagesDir, packagesThatShouldBeLibs, moduleSources) {
	// Function that converts an absolute module source to a relative one.
	const makeModuleSourceRelative = createModuleSourceProcessor(packagesThatShouldBeLibs, '/packages/');

	return (packagePath) => {
		const isApplicationPackage = isPackageInApplication(packagePath, packagesDir, packagesThatShouldBeLibs);

		if (isApplicationPackage) {
			updateAllImportsInPackage(packagePath, moduleSources, makeModuleSourceRelative);
		} else {
			updateAllImportsInPackage(packagePath, moduleSources);
		}
	};
}

// If a relative conversion function is not provided use the module source as is.
const modulesAreNotRelative = (moduleSource) => moduleSource;

function updateMappings(srcPath, moduleSources, makeModuleSourceRelative = modulesAreNotRelative) {
	let fileContents = readFileSync(srcPath, 'utf8');
	const strings = fileContents.match(/(["'])(?:(?=(\\?))\2.)*?\1/g);

	if (strings) {
		let needsWrite = false;

		strings.forEach((string) => {
			const mapping = string.replace(/'/g, '').replace(/"/g, '');
			const value = moduleSources.get(mapping);

			if (value && mapping && value !== mapping) {
				// Importing from the application's `src` directory another module in `src` must be a relative import.
				const relativeModuleSource = makeModuleSourceRelative(value, srcPath);

				fileContents = fileContents.replace(new RegExp(`['"]${mapping}['"]`, 'g'), `'${relativeModuleSource}'`);
				needsWrite = true;
			}
		});

		if (needsWrite) {
			writeFileSync(srcPath, fileContents, 'utf8');
		}
	}
}

function updateAllImportsInPackage(packagePath, moduleSources, makeModuleSourceRelative) {
	const packageJSFiles = glob.sync(`${packagePath}/**/*.js`);

	packageJSFiles.forEach((jsFilePath) => updateMappings(jsFilePath, moduleSources, makeModuleSourceRelative));
}

function getPackageSrcCommonPath(packageSrcFiles, commonRoot) {
	const directoryTree = packageSrcFiles
		.map((packageSrcFilePath) => packageSrcFilePath.replace(commonRoot, ''))
		.map((packageSrcFilePath) => packageSrcFilePath.split('/'))
		.reduce((partialDirectoryTree, filePaths) => {
			filePaths.reduce((currentTreeNode, filePath) => {
				if (currentTreeNode[filePath] === undefined) {
					currentTreeNode[filePath] = {};
				}

				return currentTreeNode[filePath];
			}, partialDirectoryTree);

			return partialDirectoryTree;
		}, {});

	let commonPath = '';
	let currentDirectory = directoryTree;

	while (Object.keys(currentDirectory).length === 1 && !Object.keys(currentDirectory)[0].endsWith('.js')) {
		const pathPart = Object.keys(currentDirectory)[0];

		commonPath = `${commonPath}${pathPart}/`;
		currentDirectory = currentDirectory[pathPart];
	}

	return commonPath;
}

function copyPackageSrcToNewLocations(packagePath, packagesDir, moduleSources) {
	const packageSrcFiles = glob.sync(`${packagePath}/src/**/*.js`);
	const commonPath = getPackageSrcCommonPath(packageSrcFiles, `${packagePath}/src/`);
	const currentFileLocationRegExp = new RegExp(`${packagePath}\/src\/${commonPath}(.*)`);

	packageSrcFiles.forEach((packageSrcFile) => {
		const currentModuleSource = packageSrcFile.replace(`${packagePath}/src/`, '').replace('.js', '');
		const newSrcFilePath = packageSrcFile.replace(currentFileLocationRegExp, `${packagePath}/$1`);
		const newModuleSource = newSrcFilePath.replace(`${packagesDir}/`, '').replace('.js', '');

		copySync(packageSrcFile, newSrcFilePath);
		moduleSources.set(currentModuleSource, newModuleSource);
	});
}

function fileExists(filePath) {
	try {
		lstatSync(filePath);
	} catch (err) {
		return false;
	}

	return true;
}

function copyPackageFoldersToNewLocations(packagePath) {
	const packageFoldersThatMustBeMoved = [
		{src: `${packagePath}/resources`, dest: `${packagePath}/_resources`},
		{src: `${packagePath}/test-unit/resources`, dest: `${packagePath}/_resources-test-ut`},
		{src: `${packagePath}/test-acceptance/resources`, dest: `${packagePath}/_resources-test-at`},
		{src: `${packagePath}/test-unit/tests`, dest: `${packagePath}/_test-ut`},
		{src: `${packagePath}/test-acceptance/tests`, dest: `${packagePath}/_test-at`},
		{src: `${packagePath}/tests/test-unit/`, dest: `${packagePath}/_test-ut`},
		{src: `${packagePath}/tests/test-acceptance/`, dest: `${packagePath}/_test-at`}
	];

	packageFoldersThatMustBeMoved
		.filter(({src}) => fileExists(src))
		.forEach(({src, dest}) => copySync(src, dest));
}

// Every package except thirdparty ones.
function findAllPackagesThatRequireConversion(packagesDir) {
	return readdirSync(packagesDir)
		.map((packagesDirContent) => `${packagesDir}/${packagesDirContent}`)
		.filter((packagesDirContentPath) => lstatSync(packagesDirContentPath).isDirectory())
		.filter((packagesDirContentPath) => fileExists(`${packagesDirContentPath}/thirdparty-lib.manifest`) === false);
}

export default function convertPackagesToNewFormat({applicationName, packagesDir, packagesThatShouldBeLibs}) {
	const applicationModuleToPathPrefix = `/apps/${applicationName}/src/`;
	const makeAppModulesRelative = createModuleSourceProcessor(packagesThatShouldBeLibs, applicationModuleToPathPrefix);
	const moduleSources = new Map();
	const packagesToConvert = findAllPackagesThatRequireConversion(packagesDir);

	// Copy all the package folders to their new locations.
	packagesToConvert.forEach(copyPackageFoldersToNewLocations);
	// Copy all the src modules to their new locations.
	packagesToConvert.forEach((packagePath) => copyPackageSrcToNewLocations(packagePath, packagesDir, moduleSources));
	// Copy all the tests to their new locations.
	// Update all the require statements.
	packagesToConvert.forEach(createPackageImportsUpdater(packagesDir, packagesThatShouldBeLibs, moduleSources));
	// Update the app and js-patches imports.
	updateAllImportsInPackage('apps', moduleSources, makeAppModulesRelative);
	updateAllImportsInPackage('brjs-app/js-patches', moduleSources);
	// Delete all the old folders and files.
	packagesToConvert.forEach(deleteUnusedFiles);
}
