'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = application => {
	application.post('/servlet/Poll', (req, res) => {
		res.send(`keep alive ${ new Date().toUTCString() }`);
	});
};