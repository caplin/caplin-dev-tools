module.exports = function appMetaLoader(appMetadataSource) {
	this.cacheable();

	// Inside BRAppMetaService we have this require `var metaData = require("app-meta!$app-metadata");`
	// this loader is used to handle that require. Webpack aliases then point to the app metadata module.
	// In future we can move to loading the application metadata in a less magical manner.
	return appMetadataSource;
};
