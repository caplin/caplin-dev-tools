import {shim} from 'array-includes';

import {moveBRJSApplicationCodeToPackages} from './convert-app';
import {createPackagesFromLibs} from './convert-libs';
import {convertSDKToPackages} from './convert-sdk';
import convertPackagesToNewFormat from './convert-packages';
import {
	createConversionMetadataDataType,
	moveCurrentCodebase,
	verifyCLIArgs
} from './converter-utils';
import {createApplicationAndVariants} from './create-applications';

shim();

// Provide the name and entry point of the app to convert. Variants is a Caplin internal option.
export default function({app, entry, vars}) {
	verifyCLIArgs(app, entry);

	const applicationVariants = vars ? vars.split(',') : [];
	const conversionMetadata = createConversionMetadataDataType(app, applicationVariants, entry);

	moveCurrentCodebase(conversionMetadata);

	const createPackages = createPackagesFromLibs(conversionMetadata);
	const moveBRJSCode = createPackages.then(() => moveBRJSApplicationCodeToPackages(conversionMetadata));
	const convertSDK = moveBRJSCode.then(() => convertSDKToPackages(conversionMetadata));
	const createApplications = convertSDK.then(() => createApplicationAndVariants(conversionMetadata));
	const convertPackages = createApplications.then(() => convertPackagesToNewFormat(conversionMetadata));

	convertPackages.catch(console.error); // eslint-disable-line
}
