import {
	join
} from 'path';

import {
	parse as babylonParse
} from 'babylon';
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
import {
	parse,
	visit
} from 'recast';

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

	for (const [, {packageDir}] of availablePackages) {
		const dependenciesDataType = findDependencies(packageDir, availablePackages);

		updatePackageJSON(dependenciesDataType);
	}
}

function isAPackageImport(astNode) {
	return astNode.callee.name === 'require' && astNode.callee.type === 'Identifier';
}

// Certain `require` calls don't have string values e.g. `dynamicRefRequire.js`.
// For these dynamic requires we set `importDeclarationSource` to a default value.
function getPackageInfo(importDeclarationSource = '', availablePackages) {
	const packageName = importDeclarationSource.split('/')[0];

	return availablePackages.get(packageName);
}

function registerImportSource(importDeclarationSource, availablePackages, dependencies) {
	const packageInfo = getPackageInfo(importDeclarationSource, availablePackages);

	if (packageInfo) {
		dependencies.add(packageInfo);
	}
}

function createImportsVisitor(dependencies, availablePackages) {
	return {
		visitCallExpression(path) {
			if (isAPackageImport(path.node)) {
				registerImportSource(path.value.arguments[0].value, availablePackages, dependencies);
			}

			this.traverse(path);
		},

		visitImportDeclaration(path) {
			registerImportSource(path.value.source.value, availablePackages, dependencies);

			return false;
		}
	};
}

const babylonParseOptions = {
	sourceType: 'module',
	plugins: ['*']
};
const recastParseOptions = {
	parser: {
		parse: (sourceCode) => babylonParse(sourceCode, babylonParseOptions)
	}
};

function extractPackagesFromJSFile(jsFile, importsVisitor) {
	try {
		const ast = parse(readFileSync(jsFile, 'utf8'), recastParseOptions);

		visit(ast, importsVisitor);
	} catch (err) {
		console.error(`${jsFile} cannot be parsed for package dependencies.`); // eslint-disable-line
		console.error(err); // eslint-disable-line
		console.log(''); // eslint-disable-line
	}
}

function findDependencies(packageDir, availablePackages) {
	const dependencies = new Set();
	const devDependencies = new Set();
	const importsVisitor = createImportsVisitor(dependencies, availablePackages);
	const packageJSFilePaths = sync(`${packageDir}/**/*.js`);

	packageJSFilePaths
		.forEach((jsFile) => extractPackagesFromJSFile(jsFile, importsVisitor));

	return {
		devDependencies,
		dependencies,
		packageDir
	};
}

function updatePackageJSON({devDependencies, dependencies, packageDir}) {
	const packageJSONFileLocation = join(packageDir, 'package.json');
	const packageJSON = readJsonSync(packageJSONFileLocation);

	if (dependencies.size > 0) {
		packageJSON.dependencies = packageJSON.dependencies || {};
	}

	if (devDependencies.size > 0) {
		packageJSON.devDependencies = packageJSON.devDependencies || {};
	}

	for (const {packageName} of dependencies) {
		packageJSON.dependencies[packageName] = `file:../${packageName}`;
	}

	for (const {packageName} of devDependencies) {
		packageJSON.devDependencies[packageName] = `file:../${packageName}`;
	}

	writeJsonSync(packageJSONFileLocation, packageJSON, {spaces: 2});
}