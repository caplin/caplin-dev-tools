const packageJSON = require("../package.json");

module.exports = {
  name: "version",

  priority: 99,

  commandFunction() {
    console.log(packageJSON.version);
  }
};
