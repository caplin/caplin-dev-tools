const commonLoader = require('./common');

module.exports = function i18nLoader(i18nPropertiesSource) {
	commonLoader(i18nPropertiesSource, createModuleSource, this);
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
