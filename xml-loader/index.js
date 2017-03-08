module.exports = function xmlLoader(xmlSource) {
  this.cacheable();

  // Escape newlines, quotes etc that would cause errors with subsequent parsing
  // of the loader return value.
  const jsonStringXMLTemplate = JSON.stringify(xmlSource);

  return `var XMLResourceService = require('br/AliasRegistry').getClass('br.xml-service');
  XMLResourceService.registerXMLFileContents(${jsonStringXMLTemplate})`;
};
