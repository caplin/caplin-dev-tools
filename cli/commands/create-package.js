const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const copyTemplate = require("../utils/copyTemplate");

function noPackagesDirectoryErrorMessage(dir) {
  console.log(`\n'${dir}' directory not found.`);
  console.log(`Please ensure you are in the project root and you have run the ${chalk.blue(
    "caplin-cli init"
  )} command`);
}

const getPackagesLocation = () => {
  const splitPath = process.cwd().split(path.sep);
  const indexOfApps = splitPath.indexOf("apps");
  const indexOfPackages = splitPath.indexOf("packages");

  let distance = 0;
  if (indexOfApps !== -1) {
    distance = splitPath.length - indexOfApps;
  } else if (indexOfPackages !== -1) {
    distance = splitPath.length - indexOfPackages;
  }

  let backPath = new Array(distance).fill("..");

  const packagesLocation = path.join(process.cwd(), ...backPath, "packages");
  if (!fs.existsSync(packagesLocation)) {
    noPackagesDirectoryErrorMessage("packages");
    process.exit(0);
  }

  return packagesLocation;
};

module.exports = {
  name: "create-package",

  priority: 10,

  options: [
    {
      name: "name",
      question: {
        type: "input",
        name: "value",
        message: "What do you want to name your package:",
        validate(name) {
          if (name !== "" && name !== null && name !== undefined) {
            const packageLocation = path.join(getPackagesLocation(), name);
            const packageAlreadyExists = fs.existsSync(packageLocation);
            if (!packageAlreadyExists) {
              return true;
            }
            return "Name is already used";
          }

          return "Name must not be blank";
        }
      }
    }
  ],

  isValidWorkingDirectory() {
    return true;
  },

  commandFunction(options) {
    const name = options[0];
    const templateId = "package-blank";
    const packagesLocation = getPackagesLocation();

    const location = path.join(packagesLocation, name);

    copyTemplate(templateId, location, {
      packageName: name
    }).then(() => {
      console.log(` New package '${name}' created!`);
      console.log(
        `
        
          Now cd into packages/${name} and run ${chalk.blue("npm init")}
          `
      );
    });
  }
};
