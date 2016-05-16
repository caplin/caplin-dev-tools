const sep = require('path').sep;

const properties = require('properties');

module.exports = function i18nLoader(i18nPropertiesSource, createModuleSource, loader) {
	loader.cacheable();

	const callback = loader.async();
	const language = loader.resource
		.split(sep)
		.pop()
		.split('.')
		.shift();

	function propertiesParsed(error, result) {
		if (error) {
			return callback(error);
		}

		return callback(null, createModuleSource(language, result));
	}

	properties.parse(i18nPropertiesSource, propertiesParsed);
};
