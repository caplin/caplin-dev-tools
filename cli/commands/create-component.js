const path = require("path");
const chalk = require("chalk");

const copyTemplate = require("../utils/copyTemplate");

const invalidComponentError = "Invalid component type, " +
  "valid options are 'blank' and 'react'.";

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
        `Component not created. React component names must begin with capital letter. Please try again with: ${name[0].toUpperCase() + name.slice(1)}`
      );
      return;
    }

    const templateId = `component-${options[1]}`;

    // check template exists

    copyTemplate(templateId, path.join(process.cwd(), name), {
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
