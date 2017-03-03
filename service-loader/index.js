const generateServiceRequireModule = require('./generateServiceRequireModule');

module.exports = function serviceLoader() {
	this.cacheable();

	return generateServiceRequireModule(this._module.rawRequest);
};
