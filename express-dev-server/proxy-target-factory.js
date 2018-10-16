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

    // Throwing an uncaught error and allowing the process to terminate is safer
    // than calling process.exit as it won't be truncate error message output.
    // https://nodejs.org/api/process.html#process_process_exit_code
    throw new Error(errorMessage);
  });

  process.stdout.on("data", stdoutData => {
    // Convert from `Buffer` to utf-8 string.
    logger.info(stdoutData.toString());
  });

  return process;
};
