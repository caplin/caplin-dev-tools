module.exports = function patchLoader(moduleSource) {
	this.cacheable();

	return this.options.patchLoader(this, moduleSource);
};
