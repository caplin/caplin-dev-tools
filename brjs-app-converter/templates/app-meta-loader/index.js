module.exports = function appMetaLoader(appMetadataSource) {
	this.cacheable();

	return appMetadataSource;
};
