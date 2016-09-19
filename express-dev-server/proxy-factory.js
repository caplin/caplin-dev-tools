'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _httpProxy = require('http-proxy');

exports.default = ({ host = 'http://localhost', port = '9999' }) => {
	const proxy = (0, _httpProxy.createProxyServer)({
		target: `${ host }:${ port }`
	});

	proxy.on('proxyReq', req => {
		console.log(`Request ${ req.path } proxied`); //eslint-disable-line
	});

	proxy.on('proxyRes', (proxyRes, req) => {
		console.log(`Response to ${ req.path } from target`); //eslint-disable-line
	});

	return proxy;
};