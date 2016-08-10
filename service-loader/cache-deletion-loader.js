const generateServiceRequireModule = require('./generateServiceRequireModule');

module.exports = function serviceLoader() {
	this.cacheable();

	const serviceRequireModule = generateServiceRequireModule(this._module.rawRequest);

	// Delete the module object from webpack's module cache so each `require('service!alias-name')` goes to the
	// `ServiceRegistry` afresh. This is necessary in tests where the services can be replaced by different stubs.
	return `${serviceRequireModule}
	delete __webpack_require__.c[module.id];`;
};
