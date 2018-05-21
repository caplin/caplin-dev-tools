const { spawn } = require("child_process");

const proxySpawnOptions = {
  // Required for Windows.
  shell: true,
  stdio: "inherit"
};

module.exports = ({
  cmd = "mvn",
  args = [
    "-f",
    "server/java/proxy-target-FXPro",
    "jetty:run",
    "-Djava.util.logging.config.file=server/java/logging.properties"
  ]
} = {}) => spawn(cmd, args, proxySpawnOptions);
