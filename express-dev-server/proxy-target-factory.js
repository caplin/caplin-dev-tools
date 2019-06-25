const { spawn } = require("child_process");
const logger = require("@caplin/node-logger");

const proxySpawnOptions = {
  // Required for Windows.
  shell: true
};

module.exports = ({
  cmd = "mvn",
  args = [
    "-q",
    "-f",
    "server/java/proxy-target-FXPro",
    "jetty:run",
    "-Djava.util.logging.config.file=server/java/logging.properties"
  ]
} = {}) => {
  const process = spawn(cmd, args, proxySpawnOptions);

  process.stderr.on("data", stderrData => {
    // Convert from `Buffer` to utf-8 string.
    const errorMessage = stderrData.toString();

    // We can't throw an error here even though it looks like the right thing
    // to do because sometimes spawned programs log to error output as part of
    // their standard logging...
    // eslint-disable-next-line no-console
    console.error(errorMessage);
  });

  process.stdout.on("data", stdoutData => {
    // Convert from `Buffer` to utf-8 string.
    logger.info(stdoutData.toString());
  });

  return process;
};
