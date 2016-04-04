// eslint-disable-next-line
'use strict';

const readFileSync = require('fs').readFileSync;
const join = require('path').join;

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
		const patchFile = readFileSync(join(patchesOptions.cwd, patchFileName), 'utf8');

		patches.set(patchFileName, patchFile);
	});

	return appendPatchToPatchedModules;
};

function appendPatchToPatchedModules(loaderAPI, moduleSource) {
	for (const arr of patches.entries()) {
		const patchFileName = arr[0];

		if (loaderAPI.resourcePath.endsWith(patchFileName)) {
			return moduleSource + arr[1];
		}
	}

	return moduleSource;
}
