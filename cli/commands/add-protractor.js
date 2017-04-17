const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const copyTemplate = require("../utils/copyTemplate");

module.exports = {
  name: "add-protractor",

  priority: 90,

  commandFunction() {
    const templateId = `protractor-tests`;
    copyTemplate(templateId, path.join(process.cwd(), "protractor-tests"), {}).then(() => {
      console.log(` Protractor Test directory added!`);
      console.log(
        `
          Ensure you have protractor installed.
        
          Now cd into protractor-tests and run ${chalk.blue("protractor conf.js")}
          `
      );
    });
  }
};