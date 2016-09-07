
module.exports = function htmlLoader(htmlSource) {
	// Escape newlines, quotes etc that would cause errors with subsequent parsing of the loader return value.
	const jsonStringHTMLTemplate = JSON.stringify(htmlSource);

	return `var ConfigurableHTMLResourceService = require('ct-services/html/ConfigurableHTMLResourceService').default;
	ConfigurableHTMLResourceService.registerHTMLFileContents(${jsonStringHTMLTemplate})`;
};
