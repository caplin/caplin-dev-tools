const path = require("path");
const chalk = require("chalk");

const copyTemplate = require("../utils/copyTemplate");

const invalidComponentError = "Invalid component type, " +
  "valid options are 'blank' and 'react'.";

const getComponentLocations = function() {
  /*
  // in project
  return ["apps/app1/src", "apps/app2/src", "packages", "./"];

  // in apps
  return ["/app1/src", "/app2/src", "./"];

  // in app
  return ["/src", "./"];

  */
  // in src or a subfolder
  return ["./"];
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
        validate(type) {
          if (type !== "blank" && type !== "react") {
            return invalidComponentError;
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

    console.log(options[2]);

    if (typeOfComponent === "react" && !nameIsCapitalised) {
      console.log(
        `Component not created. React component names must begin with capital letter. Please try again with: ${name[0].toUpperCase() + name.slice(1)}`
      );
      return;
    }

    const templateId = `component-${options[1]}`;

    // check template exists

    copyTemplate(templateId, path.join(process.cwd(), name), {
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
