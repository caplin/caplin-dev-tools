const generateServiceRequireModule = require('./generateServiceRequireModule');

module.exports = function serviceLoader() {
	this.cacheable();

	const serviceRequireModule = generateServiceRequireModule(this._module.rawRequest);

	return `${serviceRequireModule}
	delete __webpack_require__.c[module.id];`;
};
