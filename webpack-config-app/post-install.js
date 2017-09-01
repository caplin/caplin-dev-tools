const chalk = require("chalk");
const exec = require("child_process").exec;

exec("npm -v", (execError, stdin, stderr) => {
  if (stdin.startsWith("5")) {
    console.log(
      `${chalk.yellow(
        "WARNING:"
      )} You may have problems using local libraries with your current version of npm. Until npm have addressed this issue we recommend using npm 4`
    );
    console.log(
      `To change your npm version run ${chalk.blue("npm i -g npm@4")}\n`
    );
  }
});
