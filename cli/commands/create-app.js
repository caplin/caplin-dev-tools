const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const copyTemplate = require("../utils/copyTemplate");

function workingDirectoryErrorMessage(dir) {
  return `'${dir}' directory not found.

  Please ensure you are in the project root and you have run the ${chalk.blue(
    "caplin-cli init"
  )} command'`;
}

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
        validate(name) {
          if (name !== "" && name !== null && name !== undefined) {
            return true;
          }

          return "Name must not be blank";
        }
      }
    }
  ],

  isValidWorkingDirectory() {
    let appsFound = false;
    let packagesFound = false;

    try {
      appsFound = fs.lstatSync(path.join(process.cwd(), "apps")).isDirectory();
      packagesFound = fs
        .lstatSync(path.join(process.cwd(), "packages-caplin"))
        .isDirectory();
    } catch (e) {}

    if (!appsFound) return workingDirectoryErrorMessage("apps");
    if (!packagesFound) return workingDirectoryErrorMessage("packages-caplin");

    return true;
  },

  commandFunction(options) {
    const name = options[0];
    const templateId = "app-blank";

    copyTemplate(templateId, path.join(process.cwd(), "apps", name), {
      appName: name
    }).then(() => {
      console.log(` New app '${name}' created!`);
      console.log(
        `
        
          Now cd into apps/${name} and run ${chalk.blue("npm install")}
          `
      );
    });
  }
};
