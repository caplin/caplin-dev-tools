module.exports = function patchLoader(moduleSource) {
	return this.options.patchLoader(this, moduleSource);
};
