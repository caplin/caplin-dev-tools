
module.exports = function patchLoader(xmlText) {
	this.cacheable();

	// We need to turn the XML file into one long string as leaving it raw leads to JS parsing errors.
	const flattenedXMLText = xmlText.replace(/[\r\n]/g, '');

	return `
	var domParser = new DOMParser();
	var dom = domParser.parseFromString('${flattenedXMLText}', 'text/xml');

	module.exports = dom.documentElement`;
};
