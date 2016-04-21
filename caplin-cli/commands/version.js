module.exports = {

	name: "version",

	priority: 99,

	commandFunction: function() {
		console.log(require('../package.json').version);
}

};
