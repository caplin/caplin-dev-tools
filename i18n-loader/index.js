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
	const registerTranslations = `
(function () {
var p = ${JSON.stringify(result, null, '\t')};
var i = window.$_brjsI18nProperties;

if (!i.${language}) { i.${language} = {}; }
for (var key in p) { i.${language}[key] = p[key]; }
})();`;

	return registerTranslations;
}
