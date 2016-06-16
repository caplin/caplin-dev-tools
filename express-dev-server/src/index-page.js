/* eslint-disable no-process-env */

export default (application, indexPage) => {
	function indexRequestHandler(req, res) {
		const indexPageHTML = indexPage();
		const indexPageHTMLWithInjectedJNDI = indexPageHTML
			.replace(
				/@([A-Z|.]+)@/g,
				jndiTokenReplacer
			);

		res.send(indexPageHTMLWithInjectedJNDI);
	}

	application.get('/', indexRequestHandler);
};

function jndiTokenReplacer(match, jndiToken) {
	if (process.env[jndiToken]) {
		return process.env[jndiToken];
	}

	console.warn(`A value for JNDI token ${jndiToken} could not be found.`); // eslint-disable-line

	return match;
}
