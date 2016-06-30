module.exports = function serviceLoader(serviceExporterSource) {
	this.cacheable();

	// The `rawRequest` is in the form `service!br.app-meta-service` so we extract the service name.
	const requiredService = this._module.rawRequest.replace('service!', '');
	const valueToInject = `require('br/ServiceRegistry').getService('${requiredService}')`;

	// The service exporter module has a replaceable placeholder used to specify the service to
	// retrieve from the `ServiceRegistry`.
	return serviceExporterSource
		.replace(
			/loaderInjectedValue/,
			valueToInject
		);
};
