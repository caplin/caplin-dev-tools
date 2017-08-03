const fmt = require("fmt");

module.exports = {
  name: "help",

  priority: 100,

  commandFunction() {
    console.log("\n");

    fmt.title("caplin-cli commands");
    fmt.field("init", "Creates a new workspace in the current directory");
    fmt.field(
      "create-app",
      "Creates a new app with basic configuration and an example component"
    );
    fmt.field(
      "create-component",
      "Creates a component in the style of your choosing"
    );
    fmt.line();
    fmt.field("help", "Prints this list of commands");
    fmt.field("version", "Prints the current caplin-cli version");

    console.log("\n");
  }
};
