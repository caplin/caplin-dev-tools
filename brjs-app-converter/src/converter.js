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
	const i18nRequiresAdded = structureUpdated.then(() => injectI18nRequires(conversionMetadata));
	const htmlRequiresAdded = i18nRequiresAdded.then(() => injectHTMLRequires(conversionMetadata));

	htmlRequiresAdded.catch(console.error); // eslint-disable-line
}
