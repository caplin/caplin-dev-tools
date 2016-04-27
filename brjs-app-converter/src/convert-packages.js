import {copySync, lstatSync, readdirSync, readFileSync, writeFileSync} from 'fs-extra';
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

function updateMappings(srcPath, moduleSources) {
	let fileContents = readFileSync(srcPath, 'utf8');
	const strings = fileContents.match(/(["'])(?:(?=(\\?))\2.)*?\1/g);

	if (strings) {
		let needsWrite = false;

		strings.forEach((string) => {
			const mapping = string.replace(/'/g, '').replace(/"/g, '');
			const value = moduleSources.get(mapping);

			if (value && mapping && value !== mapping) {
				fileContents = fileContents.replace(new RegExp(`'${mapping}'`, 'g'), `'${value}'`);
				fileContents = fileContents.replace(new RegExp(`"${mapping}"`, 'g'), `'${value}'`);
				needsWrite = true;
			}
		});

		if (needsWrite) {
			writeFileSync(srcPath, fileContents, 'utf8');
		}
	}
}

function updateAllImportsInPackage(packagePath, moduleSources) {
	const packageJSFiles = glob.sync(`${packagePath}/**/*.js`);

	packageJSFiles.forEach((jsFilePath) => updateMappings(jsFilePath, moduleSources));
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

export default function convertPackagesToNewFormat({packagesDir}) {
	const moduleSources = new Map();
	const packagesToConvert = findAllPackagesThatRequireConversion(packagesDir);

	// Copy all the package folders to their new locations.
	packagesToConvert.forEach(copyPackageFoldersToNewLocations);
	// Copy all the src modules to their new locations.
	packagesToConvert.forEach((packagePath) => copyPackageSrcToNewLocations(packagePath, packagesDir, moduleSources));
	// Copy all the tests to their new locations.
	// Update all the require statements.
	packagesToConvert.forEach((packagePath) => updateAllImportsInPackage(packagePath, moduleSources));
	// Update the app and js-patches imports.
	updateAllImportsInPackage('apps', moduleSources);
	updateAllImportsInPackage('brjs-app/js-patches', moduleSources);
	// Delete all the old folders and files.
	packagesToConvert.forEach(deleteUnusedFiles);
}
