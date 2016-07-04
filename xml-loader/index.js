
module.exports = function patchLoader(xmlText) {
	this.cacheable();

	const flattenedXMLText = xmlText
		// We need to turn the XML file into one long string as leaving it raw leads to JS parsing errors.
		.replace(/[\r\n]/g, '')
		// We need to escape any single quotes `'` in XML comments as otherwise they would terminate
		// the `flattenedXMLText` string prematurely.
		.replace(/'/g, "\\'");

	return `
	var domParser = new DOMParser();
	var dom = domParser.parseFromString('${flattenedXMLText}', 'text/xml');

	module.exports = dom.documentElement`;
};
