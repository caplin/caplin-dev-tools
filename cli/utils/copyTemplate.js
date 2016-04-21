const copy = require('copy-template-dir');
const path = require('path');
const chalk = require('chalk');
 
module.exports = function(template, target, vars) {

	return new Promise(function(resolve, reject) {

		var inDir = path.join(__dirname, '..', 'templates', template);

		copy(inDir, target, vars, function(err, createdFiles) {
			if (err) {
				throw err
			} else {
				console.log('\n');
				createdFiles.forEach(filePath => console.log(chalk.green('\tCreated ') + filePath));
				console.log('\n');

				resolve();
			}

		});

	});

};

