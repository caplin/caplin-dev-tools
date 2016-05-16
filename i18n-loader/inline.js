const commonLoader = require('./common');

module.exports = function i18nLoader(i18nPropertiesSource) {
	commonLoader(i18nPropertiesSource, createModuleSource, this);
};

function createModuleSource(language, result) {
	return `
require('br/I18n').registerTranslations('${language}', ${JSON.stringify(result)});
`;
}
