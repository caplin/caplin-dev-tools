// eslint-disable-next-line
'use strict';

const {
	readFileSync
} = require('fs');
const {
	basename,
	join,
	sep
} = require('path');

const {
	sync
} = require('glob');

const GLOB_OPTIONS = {
	cwd: join(process.cwd(), '..', 'js-patches')
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

function appendPatchToPatchedModules(loaderAPI, moduleSource) {
	const patchEntry = patches.get(basename(loaderAPI.resourcePath));

	if (patchEntry) {
		return moduleSource + patchEntry;
	}

	return moduleSource;
}
