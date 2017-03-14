module.exports = function generateServiceRequireModule(rawRequest) {
  // The `rawRequest` is in the form `service!br.app-meta-service` so we extract
  // the service name.
  const requiredService = rawRequest.replace("service!", "");

  return `module.exports = require('br/ServiceRegistry').getService('${requiredService}');`;
};
