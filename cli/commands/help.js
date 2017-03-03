const fmt = require("fmt");

module.exports = {
  name: "help",

  priority: 100,

  commandFunction() {
    console.log("\n");

    fmt.title("caplin-cli commands");
    fmt.field("init", "Creates a new workspace in the current directory");
    fmt.field(
      "create",
      "Creates a new file structure based on the selected template"
    );
    fmt.field(
      "list",
      "Lists the current workspace`s applications and available templates"
    );
    fmt.line();
    fmt.field("help", "Prints this list of commands");
    fmt.field("version", "Prints the current caplin-cli version");

    console.log("\n");
  }
};
