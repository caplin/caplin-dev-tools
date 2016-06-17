// eslint-disable-next-line
'use strict';

const readFileSync = require('fs').readFileSync;
const join = require('path').join;
const sep = require('path').sep;
const basename = require('path').basename;
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
		const convertedPatchFileName = patchFileName.replace(/\//g, sep);
		const patchFile = readFileSync(join(patchesOptions.cwd, patchFileName), 'utf8');

		patches.set(basename(convertedPatchFileName), patchFile);
	});

	return appendPatchToPatchedModules;
};

// TODO this has be refactored to do O(1) lookups using a map rather than O(n) lookups for patches
function appendPatchToPatchedModules(loaderAPI, moduleSource) {
	const patchEntry = patches.get(basename(loaderAPI.resourcePath));

	if (patchEntry) {
		return moduleSource + patchEntry;
	}

	return moduleSource;
}
