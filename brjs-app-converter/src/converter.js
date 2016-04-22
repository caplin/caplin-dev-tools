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

	Promise.all([
		moveCurrentCodebase(conversionMetadata),
		createPackagesFromLibs(conversionMetadata),
		moveBRJSApplicationCodeToPackages(conversionMetadata),
		convertSDKToPackages(conversionMetadata)
	]).then(() => {
		convertPackagesToNewFormat(conversionMetadata);
	});
	createApplicationAndVariants(conversionMetadata);
}
