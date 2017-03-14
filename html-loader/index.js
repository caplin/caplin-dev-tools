module.exports = function htmlLoader(htmlSource) {
  this.cacheable();

  // Escape newlines, quotes etc that would cause errors with subsequent parsing
  // of the loader return value.
  const jsonStringHTMLTemplate = JSON.stringify(htmlSource);

  return `var HTMLResourceService = require('br/AliasRegistry').getClass('br.html-service');
	HTMLResourceService.registerHTMLFileContents(${jsonStringHTMLTemplate})`;
};
