
module.exports = function aliasLoader(aliasExporterSource) {
	this.cacheable();

	// The `rawRequest` is in the form `alias!caplin.fx.tenor.currency-tenors` so we extract the alias name.
	const requiredAlias = this._module.rawRequest.replace('alias!', '');

	if (requiredAlias === '$aliases-data') {
		return aliasExporterSource;
	}

	return `module.exports = require('br/AliasRegistry').getClass('${requiredAlias}')`;
};
