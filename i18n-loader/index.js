const sep = require('path').sep;

const properties = require('properties');

module.exports = function i18nLoader(i18nPropertiesSource) {
	this.cacheable();

	const callback = this.async();
	const language = this.resource
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

function createModuleSource(language, result) {
	return `
require('br/I18n').registerTranslations('${language}', ${JSON.stringify(result)});
`;
}
