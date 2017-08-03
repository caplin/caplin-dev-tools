const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const args = require("minimist")(process.argv.slice(2))._;
const copyTemplate = require("../utils/copyTemplate");

const invalidComponentError =
  "Invalid component type, " + "valid options are 'blank' and 'react'.";

const invalidLocationError =
  "Invalid location, " + "some valid options are './' and 'packages'.";

const getComponentLocations = function() {
  const targetDir = process.cwd();
  const isInProjectDir = isInProjectDirectory(targetDir);
  const isInAppsDir = path.parse(targetDir).name === "apps";
  const isInAppDir = fs.existsSync(path.join(targetDir, "src"));

  let possibleLocations = [];

  if (isInProjectDir || isInAppsDir) {
    possibleLocations = possibleLocations.concat(getLocations(isInProjectDir, targetDir));
  } else if (isInAppDir) {
    possibleLocations.push("src");
  }

  possibleLocations.push("packages");
  possibleLocations.push("./");
  return possibleLocations;
};

const getLocations = function(isInProjectDir , targetDir) {
  const appsLocationPath = isInProjectDir
    ? path.join(targetDir, "apps")
    : path.join(targetDir);
  const apps = fs.readdirSync(appsLocationPath);

  let srcLocations = [];
  apps.forEach(app => {
    if (app !== ".caplin.dir") {
      let possibleSrcLocation = path.join(appsLocationPath, app, "src");
      if (fs.existsSync(possibleSrcLocation)) {
        const location = isInProjectDir
          ? path.join("apps", app, "src")
          : path.join(app, "src");
        srcLocations.push(location);
      }
    }
  });
  return srcLocations;
};

const isInProjectDirectory = function(targetDir) {
  const appsDir = path.join(targetDir, "apps");
  const packagesDir = path.join(targetDir, "packages");
  const packagesCaplinDir = path.join(targetDir, "packages-caplin");

  return (
    fs.existsSync(appsDir) &&
    fs.existsSync(packagesDir) &&
    fs.existsSync(packagesCaplinDir)
  );
};

module.exports = {
  name: "create-component",

  priority: 15,

  options: [
    {
      name: "name",
      question: {
        type: "input",
        name: "component-name",
        message: "What do you want to name your component:",
        validate(name) {
          if (name !== "" && name !== null && name !== undefined) {
            return true;
          }

          return "Name must not be blank";
        }
      }
    },
    {
      name: "typeOfComponent",
      question: {
        type: "list",
        name: "component-type",
        message: "What type of component do you want to create:",
        choices: ["blank", "react"],
        validate(type) {
          if (type !== "blank" && type !== "react") {
            return invalidComponentError;
          }

          return true;
        }
      }
    },
    {
      name: "location",
      question: {
        type: "list",
        name: "component-location",
        message: "Where do you want to create your component?:",
        choices: getComponentLocations(),
        validate(location) {
          if (location === "" || location === undefined) {
            return invalidLocationError;
          }

          return true;
        }
      }
    }
  ],

  isValidWorkingDirectory() {
    return true;
  },

  commandFunction(options) {
    const name = options[0];
    const typeOfComponent = options[1];

    const nameIsCapitalised = name[0] === name[0].toUpperCase();

    if (typeOfComponent === "react" && !nameIsCapitalised) {
      console.log(
        `Component not created. React component names must begin with capital letter. Please try again with: ${name[0].toUpperCase() +
          name.slice(1)}`
      );
      return;
    }

    let location;

    if (options[2] === "./") {
      location = path.join(process.cwd(), name);
    } else if (options[2] === "packages") {
      const splitPath = process.cwd().split(path.sep);
      const indexOfApps = splitPath.indexOf("apps");
      let distance = 0;
      if (indexOfApps !== -1) {
        distance = splitPath.length - indexOfApps;
      }
      let backPath = new Array(distance).fill("..");
      location = path.join(process.cwd(), ...backPath, options[2], name);
    } else {
      location = path.join(process.cwd(), options[2], name);
    }

    const templateId = `component-${options[1]}`;

    // check template exists

    copyTemplate(templateId, location, {
      componentName: name,
      componentNameLowerCase: name.toLowerCase()
    })
      .then(() => {
        console.log(`New component '${name}' created!`);
      })
      .catch(e => {
        console.log(e);
      });
  }
};
