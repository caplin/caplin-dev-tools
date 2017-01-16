const {
	join
} = require('path');

import addPackageDependencies from './add-package-dependencies';
import {
	moveBRJSApplicationCodeToPackages
} from './convert-app';
import {
	createPackagesFromLibs
} from './convert-libs';
import {
	convertSDKToPackages
} from './convert-sdk';
import convertPackagesToNewFormat from './convert-packages';
import {
	createConversionMetadataDataType,
	moveCurrentCodebase,
	verifyCLIArgs
} from './converter-utils';
import {
	createApplicationAndVariants
} from './create-applications';
import {
	moveApplicationPackagesToLibs
} from './move-libs';
import {
	injectI18nRequires
} from './inject-i18n-requires';
import {
	injectHTMLRequires
} from './inject-html-requires';
import {
	runPostConversionScript
} from './post-conversion-script';

// Provide the name of the app to convert.
export default function({app}) {
	verifyCLIArgs(app);

	let convertPackagesFunction = () => {
		// Used by the post conversion script to re-write require statements in code
		// that wasn't covered by the conversion tool.
	};
	const conversionMetadata = createConversionMetadataDataType(app);

	moveCurrentCodebase(conversionMetadata);

	const createPackages = createPackagesFromLibs(conversionMetadata);
	const moveBRJSCode = createPackages.then(() => moveBRJSApplicationCodeToPackages(conversionMetadata));
	let convertSDK = moveBRJSCode.then(() => convertSDKToPackages(conversionMetadata));

	if (app === 'ct') {
		convertSDK = convertSDK.then(() => {
			return convertSDKToPackages({
				packagesDir: conversionMetadata.packagesDir,
				sdkJSLibrariesDir: join('..', 'conversion-data', 'sdk', 'libs', 'javascript')
			});
		});
	}

	const createApplications = convertSDK.then(() => createApplicationAndVariants(conversionMetadata));
	const convertPackages = createApplications.then(() => {
		convertPackagesFunction = convertPackagesToNewFormat(conversionMetadata);
	});
	const structureUpdated = convertPackages.then(() => moveApplicationPackagesToLibs(conversionMetadata));
	const i18nRequiresAdded = structureUpdated.then(() => injectI18nRequires(conversionMetadata));
	const htmlRequiresAdded = i18nRequiresAdded.then(() => {
		console.log('Adding HTML requires'); // eslint-disable-line

		injectHTMLRequires(conversionMetadata);
	});
	const packageDependenciesAdded = htmlRequiresAdded.then(() => {
		console.log('Adding package dependencies.'); // eslint-disable-line

		addPackageDependencies(conversionMetadata);
	});
	const postConversionScript = packageDependenciesAdded.then(() => {
		console.log('Running post conversion script.'); // eslint-disable-line

		runPostConversionScript(conversionMetadata, convertPackagesFunction);
	});

	postConversionScript.catch(console.error); // eslint-disable-line
}
