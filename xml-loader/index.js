
module.exports = function xmlLoader(xmlSource) {
	this.cacheable();

	// Escape newlines, quotes etc that would cause errors with subsequent parsing of the loader return value.
	const jsonStringXMLTemplate = JSON.stringify(xmlSource);

	return `var ConfigurableXMLResourceService = require('ct-services/xml/ConfigurableXMLResourceService').default;
	ConfigurableXMLResourceService.registerXMLFileContents(${jsonStringXMLTemplate})`;
};
