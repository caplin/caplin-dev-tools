var autoload = require('auto-load');
var commands = autoload(__dirname + '/commands');

module.exports = Object.keys(commands)
	.map(function(name) {
  		return commands[name]
	})
	.sort(function(a, b) {
		if (a.priority < b.priority) {
			return -1;
		}
		if (a.priority > b.priority) {
			return 1;
		}
		return 0;
	});
