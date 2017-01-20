
module.exports = function nullModule(moduleName) {
	throw new Error('Null module called requesting ' + moduleName);
};
