import {
	join
} from 'path';

import {
	readdirSync,
	readFileSync,
	readJsonSync,
	statSync,
	writeJsonSync
} from 'fs-extra';
import {
	sync
} from 'glob';
import jscodeshift from 'jscodeshift';

export default function({packagesDir}) {
	const possiblePackages = readdirSync(packagesDir);
	const availablePackages = new Map();

	for (const packageName of possiblePackages) {
		const packageDir = join(packagesDir, packageName);

		if (statSync(packageDir).isDirectory()) {
			availablePackages
				.set(packageName, {
					packageName,
					packageDir
				});
		}
	}

	for (const [packageName, {packageDir}] of availablePackages) {
		const dependenciesDataType = findDependencies(packageDir, availablePackages);

		updatePackageJSON(dependenciesDataType);
	}
}

function isAPackageImport(astNode) {
	return astNode.callee.name === 'require' && astNode.callee.type === 'Identifier';
}

function getPackageInfo(importID, availablePackages) {
	const packageName = importID.split('/')[0];

	return availablePackages.get(packageName);
}

function extractPackagesFromJSFile(jsFile, dependencies, availablePackages) {
	jscodeshift(readFileSync(jsFile, 'utf8'))
		.find('CallExpression', isAPackageImport)
		.forEach((path) => {
			const packageInfo = getPackageInfo(path.value.arguments[0].value, availablePackages)

			if (packageInfo) {
				dependencies.add(packageInfo);
			}
		});
}

function findDependencies(packageDir, availablePackages) {
	const dependencies = new Set();
	const devDependencies = new Set();
	const packageJSFilePaths = sync(`${packageDir}/**/*.js`);

	packageJSFilePaths
		.forEach((jsFile) => extractPackagesFromJSFile(jsFile, dependencies, availablePackages));

	return {
		devDependencies,
		dependencies,
		packageDir
	};
}

function updatePackageJSON({devDependencies, dependencies, packageDir}) {
	const packageJSONFileLocation = join(packageDir, 'package.json');
	const packageJSON = readJsonSync(packageJSONFileLocation);

	packageJSON.dependencies = packageJSON.dependencies || {};
	packageJSON.devDependencies = packageJSON.devDependencies || {};

	for (const {packageDir, packageName} of dependencies) {
		packageJSON.dependencies[packageName] = `file:../${packageName}`;
	}

	for (const {packageDir, packageName} of devDependencies) {
		packageJSON.devDependencies[packageName] = `file:../${packageName}`;
	}

	writeJsonSync(packageJSONFileLocation, packageJSON, {spaces: 2});
}