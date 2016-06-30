module.exports = function aliasLoader(aliasExporterSource) {
	this.cacheable();

	// The `rawRequest` is in the form `alias!caplin.fx.tenor.currency-tenors` so we extract the alias name.
	const requiredAlias = this._module.rawRequest.replace('alias!', '');
	const valueToInject = `require('br/AliasRegistry').getClass('${requiredAlias}')`;

	// The alias exporter module has a replaceable placeholder used to specify the alias to
	// retrieve from the `AliasRegistry`.
	return aliasExporterSource
		.replace(
			/loaderInjectedValue/,
			valueToInject
		);
};
