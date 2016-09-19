'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = (application, proxy) => {
	function proxyRequest(req, res) {
		proxy.web(req, res);
	}

	application.get('/servlet/webcentric/*', proxyRequest);
	application.post('/servlet/webcentric/*', proxyRequest);
};