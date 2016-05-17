'use strict';

module.exports = function nullModule() {
	throw new Error('Null module called ' + arguments);
};