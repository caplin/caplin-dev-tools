'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (application) {
	application.post('/servlet/Poll', function (req, res) {
		res.send('keep alive ' + new Date().toUTCString());
	});
};