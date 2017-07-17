const path = require("path");
const chalk = require("chalk");
const fs = require("fs");

const copyTemplate = require("../utils/copyTemplate");

const invalidComponentError =
  "Invalid component type, " + "valid options are 'blank' and 'react'.";

const invalidLocationError =
  "Invalid location, " + "some valid options are './' and 'packages'.";

const getComponentLocations = function() {
  const targetDir = process.cwd().split("\\");
  const isProject = !targetDir.includes("apps");
  let possibleLocations = [];
  if (isProject || targetDir.indexOf("apps") === targetDir.length - 1) {
    let locationPath = isProject
      ? path.join(...targetDir, "apps")
      : path.join(...targetDir);
    fs.readdir(locationPath, (err, files) => {
      files.forEach(app => {
        if (app !== ".caplin.dir") {
          let appLocation = isProject
            ? path.join("apps", app, "src")
            : path.join(app, "src");
          possibleLocations.push(appLocation);
        }
      });
    });
  } else {
    possibleLocations.push("src");
  }

  possibleLocations.push("packages");
  possibleLocations.push("./");
  return possibleLocations;
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
      const splitPath = process.cwd().split("\\");
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
      componentName: name
    })
      .then(() => {
        console.log(`New component '${name}' created!`);
      })
      .catch(e => {
        console.log(e);
      });
  }
};
