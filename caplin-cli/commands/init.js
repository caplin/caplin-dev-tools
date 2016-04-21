var fs = require('fs');
var copyTemplate = require('../utils/copyTemplate');

module.exports = {

	name: "init",

	priority: 5,

	isValidWorkingDirectory: function(dir) {

		if (fs.readdirSync(dir).length === 0) {
			return true;
		} else {
			return `'init' needs to be run in an empty directory. Check you don't have any hidden files or folders.`;
		}

	},

	commandFunction: function() {
		copyTemplate('workspace', process.cwd(), {});
	}

}
