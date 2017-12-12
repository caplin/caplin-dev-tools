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
          let fileName = path.basename(filePath);
          let dirName = path.dirname(filePath);

          if (/react-component/g.test(fileName)) {
            const newFilePath = path.resolve(
              dirName,
              fileName.replace(/react-component/g, vars.componentName)
            );

            renameFile(filePath, newFilePath);
            console.log(chalk.green("\tCreated ") + newFilePath);
          } else if (/package-name/g.test(fileName)) {
            const newFilePath = path.resolve(
              dirName,
              fileName.replace(/package-name/g, vars.packageName)
            );

            renameFile(filePath, newFilePath);
            console.log(chalk.green("\tCreated ") + newFilePath);
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
