// eslint-disable-next-line
'use strict';

const readFileSync = require('fs').readFileSync;
const join = require('path').join;
const sep = require('path').sep;

const sync = require('glob').sync;

const GLOB_OPTIONS = {
	cwd: join(__dirname, '..', '..', '..', '..', '..', 'brjs-app', 'js-patches')
};
const patches = new Map();

module.exports.appendModulePatch = function appendModulePatch(options) {
	const patchesOptions = options || GLOB_OPTIONS;
	const patchFiles = sync('**/*.js', patchesOptions);

	patches.clear();
	patchFiles.forEach((patchFileName) => {
		// node glob returns paths with unix backslashes even in windows so we convert the slashes to
		// the separator of the env to allow successful matching in `appendPatchToPatchedModules`
		// see https://github.com/isaacs/node-glob/issues/173
		const convertedPatchFileName = patchFileName.replace('/', sep);
		const patchFile = readFileSync(join(patchesOptions.cwd, patchFileName), 'utf8');

		patches.set(convertedPatchFileName, patchFile);
	});

	return appendPatchToPatchedModules;
};

function appendPatchToPatchedModules(loaderAPI, moduleSource) {
	for (const arr of patches.entries()) {
		const convertedPatchFileName = arr[0];

		if (loaderAPI.resourcePath.endsWith(convertedPatchFileName)) {
			return moduleSource + arr[1];
		}
	}

	return moduleSource;
}
