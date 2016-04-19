import glob from "glob";
import path from "path";
import mv from 'mv';
import rimraf from 'rimraf';
import fs from 'fs';
import chalk from 'chalk';

const slash = path.sep;
const rootDir = process.cwd();

function getBasePath(sourceFiles) {
	let firstDir = path.dirname(sourceFiles[0]);
	const lastDir = path.dirname(sourceFiles[sourceFiles.length - 1]);
	let attempts = 0;

	while (attempts < 3) {
		attempts++;
		if (lastDir.indexOf(firstDir) !== -1) {
			return firstDir;
		} else {
			firstDir = path.dirname(firstDir);
		}
	}
}

// move src/somename/**/*.js -> ./**/*.js
function moveTest(absolutePath, subDirectory, fileName, testTypeDir) {
	// testTypeDir
	return new Promise((resolve, reject) => {
		const testFile = absolutePath + '/' + testTypeDir + subDirectory + '/' + fileName + 'Test.js';
		const moveToPath = absolutePath + subDirectory + '/' + testTypeDir + '/' + fileName + 'Test.js';
		// move test-unit/tests/**/*.js -> ~tests/*.js
		if (fileExists(testFile)) {
			mv(testFile, moveToPath, { mkdirp: true }, err => {
				resolve();
			});
		} else {
			resolve();
		}
	});
}

function fileExists(path) {
	try {
		fs.accessSync(path, fs.F_OK);
		return true;
	} catch (e) {
		return false;
	}
	return false;
}

function getFiles(dir, files_){
	files_ = files_ || [];
	var files = fs.readdirSync(dir);
	for (var i in files){
		var name = dir + '/' + files[i];
		if (fs.statSync(name).isDirectory()){
			getFiles(name, files_);
		} else {
			files_.push(name);
		}
	}
	return files_;
}

export default function convertPackagesToNewFormat({ packagesDir }) {
	const jsRequireMappings = Object.create(null);

	// Generate mappings for all logical .js files in this working dir
	glob.sync(packagesDir + '/**/*.js').forEach(srcPath => {
		// remove initial prefix path /foo/
		if (srcPath.indexOf('test-unit') === -1 && srcPath.indexOf('test-acceptance') === -1) {
			const packagePath = srcPath.replace(packagesDir + '/', '').replace('.js', '');
			const mappingKey = packagePath.replace(packagePath.split('/')[0] + '/src/', '');
			jsRequireMappings[mappingKey] = null;
		}
	});

	console.log(chalk.white(`Converting packages...`));
	// Now we go through each package and re-structure the package
	// we also go through each src file and re-map the require path if needed
	Promise.all(fs.readdirSync(packagesDir).map(workingDir => new Promise((resolve, reject) => {
		const absolutePath = packagesDir + '/' + workingDir;

		if (!fs.lstatSync(absolutePath).isDirectory()) {
			resolve();
			return;
		}
		const sourceFiles = glob.sync(absolutePath + '/src/**/*.js');
		const basePath = getBasePath(sourceFiles);

		Promise.all([
			new Promise((resolve, reject) =>
				mv(absolutePath + '/resources', absolutePath + '/_resources', { mkdirp: true }, err => resolve(err))),
			new Promise((resolve, reject) =>
				mv(absolutePath + '/test-unit/resources', absolutePath + '/_resources-test-ut', { mkdirp: true }, err => resolve(err))),
			new Promise((resolve, reject) =>
				mv(absolutePath + '/test-acceptance/resources', absolutePath + '/_resources-test-at', { mkdirp: true }, err => resolve(err))),
			new Promise((resolve, reject) =>
				mv(absolutePath + '/test-unit/tests', absolutePath + '/_test-ut', { mkdirp: true }, err => resolve(err))),
			new Promise((resolve, reject) =>
				mv(absolutePath + '/test-acceptance/tests', absolutePath + '/_test-at', { mkdirp: true }, err => resolve(err))),
			new Promise((resolve, reject) =>
				mv(absolutePath + '/tests/test-unit/', absolutePath + '/_test-ut', { mkdirp: true }, err => resolve(err))),
			new Promise((resolve, reject) =>
				mv(absolutePath + '/tests/test-acceptance/', absolutePath + '/_test-at', { mkdirp: true }, err => resolve(err)))
		]).then(err => {
			Promise.all(sourceFiles.map(filePath => new Promise((resolve, reject) => {
				const fileName = path.basename(filePath, '.js');
				const subDirectory = path.dirname(filePath).replace(basePath, '');
				const mappingKey = filePath.replace(absolutePath + '/', '').replace('.js', '').replace('src/', '');
				const mappingValue = workingDir + subDirectory + '/' + fileName;
				const moveToPath = 'packages/' + mappingValue + '.js';

				jsRequireMappings[mappingKey] = mappingValue;

				if (fileExists(filePath)) {
					mv(filePath, moveToPath, { mkdirp: true }, err => {
						Promise.all([
							moveTest(absolutePath, subDirectory, fileName, '_test-ut'),
							moveTest(absolutePath, subDirectory, fileName, '_test-at')
						]).then(function() {
							resolve();
						});
					});
				} else {
					resolve();
				}
			}))).then(done => {
				rimraf.sync(absolutePath + '/src');
				rimraf.sync(absolutePath + '/tests');
				rimraf.sync(absolutePath + '/test-unit');
				rimraf.sync(absolutePath + '/test-acceptance');
				rimraf.sync(absolutePath + '/compiled');
				rimraf.sync(absolutePath + '/br-lib.conf');
				rimraf.sync(absolutePath + '/_resources/aliases.xml');
				rimraf.sync(absolutePath + '/_resources/aliasDefinitions.xml');
				rimraf.sync(absolutePath + '/_resources-test-ut/aliases.xml');
				rimraf.sync(absolutePath + '/_resources-test-ut/aliasDefinitions.xml');
				rimraf.sync(absolutePath + '/_resources-test-at/aliases.xml');
				rimraf.sync(absolutePath + '/_resources-test-at/aliasDefinitions.xml');

				console.log(chalk.green(`Converted "${ workingDir }"`));
				resolve();
			}).catch(err => {
				console.log(err);
				resolve();
			});
		}).catch(err => {
			console.log(err);
			resolve();
		});
	}))).then(done => {
		console.log(chalk.white(`Updating require mappings...`));
		// Go through every source file and update mappings to the new ones
		glob.sync(rootDir + '/**/*.js').forEach(srcPath => {
			if (srcPath.indexOf('test-unit') === -1
				&& srcPath.indexOf('test-acceptance') === -1
				&& srcPath.indexOf('node_modules') === -1
				&& srcPath.indexOf('converted_library') === -1) {

				let fileContents = fs.readFileSync(srcPath, 'utf8');
				const strings = fileContents.match(/(["'])(?:(?=(\\?))\2.)*?\1/g)

				if (strings) {
					let needsWrite = false;

					for (let i = 0; i < strings.length; i++) {
						const mapping = strings[i].replace(/'/g, '').replace(/"/g, '');
						const value = jsRequireMappings[mapping];

						if (value && mapping) {
							fileContents = fileContents.replace(
								new RegExp(`'${ mapping }'`, 'g'), `'${ value }'`
							);
							fileContents = fileContents.replace(
								new RegExp(`"${ mapping }"`, 'g'), `"${ value }"`
							);
							needsWrite = true;
						}
					}
					if (fileContents.indexOf('/test-unit/resources/') !== -1) {
						fileContents = fileContents.replace(
							/\/test-unit\/resources\//g, '/_resources-test-ut/'
						);
						needsWrite = true;
					}
					if (fileContents.indexOf('/test-acceptance/resources/') !== -1) {
						fileContents = fileContents.replace(
							/\/test-unit\/resources\//g, '/_resources-test-at/'
						);
						needsWrite = true;
					}
					if (fileContents.indexOf('/resources/') !== -1) {
						fileContents = fileContents.replace(
							/\/resources\//g, '/_resources/'
						);
						needsWrite = true;
					}
					if (needsWrite) {
						//console.log(chalk.green(`Updated "${ srcPath }"`));
						fs.writeFileSync(srcPath, fileContents, 'utf8')
					}
				}
			}
		});
		console.log(chalk.white(`Updated require mappings`));
		console.log(chalk.white(`Conversion complete!`));
	}).catch(err => {
		console.log(chalk.red(err + '\n'));
		console.log(chalk.red(`Failure!`));
	});
}