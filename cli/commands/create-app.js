var path = require("path");
var chalk = require("chalk");
var fs = require("fs");
var copyTemplate = require("../utils/copyTemplate");

var workingDirectoryErrorMessage = function(dir) {
  return `'${dir}' directory not found.

  Please ensure you are in the project root and you have run the ${chalk.blue(
    "caplin-cli init"
  )} command'`;
};

module.exports = {
  name: "create-app",

  priority: 10,

  options: [
    {
      name: "name",
      question: {
        type: "input",
        name: "value",
        message: "What do you want to name your app:",
        validate: function(name) {
          if (name !== "" && name !== null && name !== undefined) {
            return true;
          } else {
            return "Name must not be blank";
          }
        }
      }
    }
  ],

  isValidWorkingDirectory: function(dir) {
    var appsFound = false, packagesFound = false;

    try {
      appsFound = fs.lstatSync(path.join(process.cwd(), "apps")).isDirectory();
      packagesFound = fs
        .lstatSync(path.join(process.cwd(), "caplin-packages"))
        .isDirectory();
    } catch (e) {
    }

    if (!appsFound) return workingDirectoryErrorMessage("apps");
    if (!packagesFound) return workingDirectoryErrorMessage("caplin-packages");

    return true;
  },

  commandFunction: function(options) {
    var name = options[0];
    var templateId = "app-blank";

    copyTemplate(templateId, path.join(process.cwd(), "apps", name), {
      appName: name
    }).then(function() {
      console.log("\tNew app '" + name + "' created!");
      console.log(
        "\n\n\tNow cd into apps/" +
          name +
          " and run " +
          chalk.blue("npm install") +
          "\n"
      );
    });
  }
};
