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
import {moveApplicationPackagesToLibs} from './move-libs';

// Provide the name and entry point of the app to convert. Variants is a Caplin internal option.
export default function({app}) {
	verifyCLIArgs(app);

	const conversionMetadata = createConversionMetadataDataType(app);

	moveCurrentCodebase(conversionMetadata);

	const createPackages = createPackagesFromLibs(conversionMetadata);
	const moveBRJSCode = createPackages.then(() => moveBRJSApplicationCodeToPackages(conversionMetadata));
	const convertSDK = moveBRJSCode.then(() => convertSDKToPackages(conversionMetadata));
	const createApplications = convertSDK.then(() => createApplicationAndVariants(conversionMetadata));
	const convertPackages = createApplications.then(() => convertPackagesToNewFormat(conversionMetadata));
	const structureUpdated = convertPackages.then(() => moveApplicationPackagesToLibs(conversionMetadata));

	structureUpdated.catch(console.error); // eslint-disable-line
}
