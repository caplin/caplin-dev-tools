module.exports = function htmlLoader(htmlSource) {
  // Escape newlines, quotes etc that would cause errors with subsequent parsing
  // of the loader return value.
  const jsonStringHTMLTemplate = JSON.stringify(htmlSource);

  return `var HTMLResourceService = require('alias!br.html-service');
  HTMLResourceService.registerHTMLFileContents(${jsonStringHTMLTemplate})`;
};
