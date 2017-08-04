const copy = require("copy-template-dir");
const path = require("path");
const chalk = require("chalk");
const fs = require("fs");

const renameFile = (filePath, newFileName) => {
  fs.rename(filePath, newFileName, err => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

module.exports = function(template, target, vars) {
  return new Promise(function(resolve, reject) {
    var inDir = path.join(__dirname, "..", "templates", template);

    copy(inDir, target, vars, function(err, createdFiles) {
      if (err) {
        throw err;
      } else {
        console.log("\n");

        createdFiles.forEach(filePath => {
          if (filePath.indexOf("react-component") !== -1) {
            const newFileName = filePath.replace(
              /react-component/g,
              `${vars.componentName}`
            );
            renameFile(filePath, newFileName);
            console.log(chalk.green("\tCreated ") + newFileName);
          } else if (filePath.indexOf("package-name") !== -1) {
            const newFileName = filePath.replace(
              /package-name/g,
              `${vars.packageName}`
            );
            renameFile(filePath, newFileName);
            console.log(chalk.green("\tCreated ") + newFileName);
          } else {
            console.log(chalk.green("\tCreated ") + filePath);
          }
        });

        console.log("\n");

        resolve();
      }
    });
  });
};
