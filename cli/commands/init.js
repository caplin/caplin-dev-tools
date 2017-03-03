const fs = require("fs");
const copyTemplate = require("../utils/copyTemplate");

module.exports = {
  name: "init",

  priority: 5,

  isValidWorkingDirectory(dir) {
    if (fs.readdirSync(dir).length === 0) {
      return true;
    }

    return `'init' needs to be run in an empty directory. Check you don't have any hidden files or folders.`;
  },

  commandFunction() {
    copyTemplate("workspace", process.cwd(), {});
  }
};
