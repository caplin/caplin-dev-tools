import {
	sep
} from 'path';

import {
	copySync
} from 'fs-extra';
import glob from 'glob';

import {
	copyPackageFoldersToNewLocations,
	deleteUnusedFiles
} from './convert-packages';

export function runPostConversionScript(conversionMetadata) {
	let postConversionScript = () => {
		// The default post conversion script does nothing.
	};
	const scriptName = `post-conversion-${conversionMetadata.applicationName}`;
	// Convert Windows separator to Unix style for module URIs.
	const moduleURIPrefix = process
		.cwd()
		.split(sep)
		.join('/');
	// The location has to be absolute, cannot fathom why, even when correctly relative to `cwd`.
	const scriptLocation = `${moduleURIPrefix}/../conversion-data/${scriptName}`;

	try {
		postConversionScript = require(scriptLocation); // eslint-disable-line
	} catch (err) {
		// Ignore error if this application has no post conversion script to run.
	}

	postConversionScript(conversionMetadata, {
		copyPackageFoldersToNewLocations, copySync, deleteUnusedFiles, glob
	});
}
