import {
	readFileSync,
	writeFileSync
} from 'fs';
import {
	dirname,
	relative
} from 'path';

import {
	sync
} from 'glob';
import {
	parse
} from 'properties';

const globOptions = {
	ignore: [
		'**/_test-[a|u]t/**',
		'**/node_modules/**',
		'**/workbench/resources/**'
	]
};

export function injectI18nRequires({applicationName, packagesDirName = 'packages'} = {}) {
	const appJSFilePaths = sync(`apps/${applicationName}/src/**/*.js`);
	const appPropertiesFilePaths = sync(`apps/${applicationName}/src/**/en.properties`, globOptions);
	const propertiesToFilePath = new Map();
	const packageJSFilePaths = sync(`${packagesDirName}/**/*.js`);
	const packagePropertiesFilePaths = sync(`${packagesDirName}/**/en.properties`, globOptions);

	// Firstly add package to package requires.
	registerI18nProperties(packagePropertiesFilePaths, propertiesToFilePath);
	packageJSFilePaths
		.forEach((jsFilePath) => addI18nRequires(
			jsFilePath, propertiesToFilePath, isRelativePackage(), dirPrefixRemover(`${packagesDirName}/`)
		));
	// Then add requires to app source code.
	registerI18nProperties(appPropertiesFilePaths, propertiesToFilePath);
	appJSFilePaths
		.forEach((jsFilePath) => addI18nRequires(
			jsFilePath, propertiesToFilePath, isRelativeApp(applicationName), dirPrefixRemover(`${packagesDirName}/`)
		));
}

// Read the provided properties and register their file location to allow `require`s pointing
// toward the file that contains them to be added.
function registerI18nProperties(propertiesFilePaths, propertiesToFilePath) {
	propertiesFilePaths
		.forEach((propertiesFilePath) => {
			const propertiesFile = readFileSync(propertiesFilePath, 'utf8');
			const properties = parse(propertiesFile);

			Object
				.keys(properties)
				.forEach((property) => {
					if (propertiesToFilePath.has(property)) {
						propertiesToFilePath.get(property).push(propertiesFilePath);
					} else {
						propertiesToFilePath.set(property, [propertiesFilePath]);
					}
				});
		});
}

// Scans the provided file to find i18n tokens used within.
function discoverI18nProperties(jsFilePath, propertiesToFilePath) {
	const discoveredTokens = new Set();
	const jsFile = readFileSync(jsFilePath, 'utf8');
	const i18nTokensRegExp = /['|"](.*?)['|"]/g;
	let matchArray = [];

	while ((matchArray = i18nTokensRegExp.exec(jsFile)) !== null) {
		const possibleI18nProperty = matchArray[1];

		if (propertiesToFilePath.has(possibleI18nProperty)) {
			discoveredTokens.add(possibleI18nProperty);
		} else if (possibleI18nProperty.endsWith('.')) {
			for (const [property] of propertiesToFilePath) {
				if (property.startsWith(possibleI18nProperty)) {
					discoveredTokens.add(possibleI18nProperty);
					break;
				}
			}
		}
	}

	return discoveredTokens;
}

// If a file uses i18n tokens add requires to the properties files it relies upon.
function addI18nRequires(jsFilePath, propertiesToFilePath, isRelative, removeDirPrefix) {
	const discoveredTokens = discoverI18nProperties(jsFilePath, propertiesToFilePath);

	if (discoveredTokens.size > 0) {
		const propertiesFilesToRequire = new Set();

		discoveredTokens
			.forEach((discoveredToken) => {
				calculatePropertiesFileToRequire(
					propertiesToFilePath, discoveredToken, propertiesFilesToRequire, jsFilePath
				);
			});
		const requirePaths = resolveI18nRequirePaths(jsFilePath, propertiesFilesToRequire, isRelative, removeDirPrefix);
		const requireStatements = requirePaths
			.map((requirePath) => `require('${requirePath}');`);
		const jsFile = readFileSync(jsFilePath);

		writeFileSync(jsFilePath, `${requireStatements.join('\n')}\n${jsFile}`);
	}
}

// Attempt to find a single properties file that provides the `discoveredToken`.
function calculatePropertiesFileToRequire(propertiesToFilePath, discoveredToken, propertiesFilesToRequire, jsFilePath) {
	if (propertiesToFilePath.has(discoveredToken)) {
		const propertiesFilePaths = propertiesToFilePath.get(discoveredToken);

		selectPropertyFileToRequire(propertiesFilePaths, jsFilePath, propertiesFilesToRequire);
	} else if (discoveredToken.endsWith('.')) {
		searchForPropertiesPrefix(propertiesToFilePath, discoveredToken, jsFilePath, propertiesFilesToRequire);
	} else {
		console.warn(`In ${jsFilePath} token ${discoveredToken} has no possible require.`); // eslint-disable-line
	}
}

function selectPropertyFileToRequire(propertiesFilePaths, jsFilePath, propertiesFilesToRequire) {
	if (propertiesFilePaths.length === 1) {
		propertiesFilesToRequire.add(propertiesFilePaths[0]);
	} else {
		console.warn( // eslint-disable-line
			`In ${jsFilePath} there are multiple possible requires, skipping: ${propertiesFilePaths.join('\n')}.`
		);
	}
}

function searchForPropertiesPrefix(propertiesToFilePath, discoveredToken, jsFilePath, propertiesFilesToRequire) {
	const allPossibleFilePaths = new Set();

	for (const [property, filePaths] of propertiesToFilePath) {
		if (property.startsWith(discoveredToken)) {
			allPossibleFilePaths.add(...filePaths);
		}
	}

	if (allPossibleFilePaths.size === 1) {
		const filePaths = [allPossibleFilePaths.values().next().value];

		selectPropertyFileToRequire(filePaths, jsFilePath, propertiesFilesToRequire);
	} else if (allPossibleFilePaths.size > 1) {
		console.warn( // eslint-disable-line
			`In ${jsFilePath} with prefixed token ${discoveredToken} there are multiple possible requires, skipping.`
		);

		allPossibleFilePaths.forEach((possibleFilePath) => {
			console.warn(possibleFilePath); // eslint-disable-line
		});
	} else if (allPossibleFilePaths.size === 0) {
		console.warn( // eslint-disable-line
			`In ${jsFilePath} with prefixed token ${discoveredToken} there are no possible requires.`
		);
	}
}

function resolveI18nRequirePaths(jsFilePath, propertiesFilesToRequire, isRelative, removeDirPrefix) {
	const jsFileDir = dirname(jsFilePath);
	const requirePaths = new Set();

	for (const propertyFileToRequire of propertiesFilesToRequire) {
		let requirePath = removeDirPrefix(propertyFileToRequire);

		if (isRelative(propertyFileToRequire, jsFileDir)) {
			requirePath = relative(jsFileDir, propertyFileToRequire);

			if (requirePath.startsWith('..') === false) {
				requirePath = `./${requirePath}`;
			}
		}

		requirePaths.add(requirePath);
	}

	return [...requirePaths];
}

function dirPrefixRemover(prefix) {
	return (jsFilePath) => jsFilePath.replace(prefix, '');
}

function isRelativePackage() {
	return (propertyFileToRequire, jsFileDir) => {
		// Are we requiring a properties file from the same package.
		return propertyFileToRequire.split('/')[1] === jsFileDir.split('/')[1];
	};
}

function isRelativeApp(applicationName) {
	return (propertyFileToRequire) => propertyFileToRequire.startsWith(`apps/${applicationName}/`);
}
