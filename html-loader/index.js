module.exports = function htmlLoader(htmlSource) {
  // Escape newlines, quotes etc that would cause errors with subsequent parsing
  // of the loader return value.
  const jsonStringHTMLTemplate = JSON.stringify(htmlSource);

  // Older versions of projects can't use `require('alias!br.html-service')`
  // so if changing to require please major rev the loader version.
  return `var HTMLResourceService = require('br/AliasRegistry').getClass('br.html-service');
 	HTMLResourceService.registerHTMLFileContents(${jsonStringHTMLTemplate})`;
};
