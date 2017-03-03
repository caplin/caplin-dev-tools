
module.exports = function appendingHTMLLoader(moduleRegisteringHTMLSource) {
	// Tweak the returned module source to register the HTML file and to have it appended to the document head.
	return moduleRegisteringHTMLSource
		.replace(
			'registerHTMLFileContents',
			'registerAndAppendHTMLFileContents'
		);
};
