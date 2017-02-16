var path = require('path');
var chalk = require('chalk');
var copyTemplate = require('../utils/copyTemplate');

module.exports = {

	name: "create-component",

	priority: 15,

	options: [
		{
			name: 'name',
			question: {
				type: 'input',
				name: 'component-name',
				message: 'What do you want to name your component:',
				validate: function(name) {

					if (name !== "" && name !== null && name !== undefined) {
						return true;
					} else {
						return "Name must not be blank"
					}

				}
			}
		},
		{
			name: 'typeOfComponent',
			question: {
				type: 'list',
				name: 'component-type',
				message: 'What type of component do you want to create:',
				choices: ['blank', 'react'],
				validate: function(type) {

					if (type !== 'blank' && type !== 'react') {
						return "Invalid component type, valid options are 'blank' and 'react'."
					} else {
						return true;
					}

				}
			}
		}
	],

	isValidWorkingDirectory: function(dir) {
		return true;
	},

	commandFunction: function(options) {
		var name = options[0];
		var typeOfComponent = options[1];
		var nameIsCapitalised = name[0] == name[0].toUpperCase();

		if(typeOfComponent === 'react' && !nameIsCapitalised) {
			console.log("Component not created. React component names must begin with capital letter. Please try again with: " + name[0].toUpperCase() + name.slice(1));
			return;
		}

		var templateId = "component-" + options[1];

		// check template exists

		copyTemplate(templateId, path.join(process.cwd(), name), {
			componentName: name
		})
		.then(function() {
			console.log('\tNew component \'' + name + '\' created!' );
			console.log('\n\n\tNow cd into components/' + name + ' and run ' + chalk.blue('npm run workbench') + '\n' );
		})
		.catch(function(e) {
			console.log(e)
		});

	}

};