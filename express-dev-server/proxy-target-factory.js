const { spawn } = require("child_process");

const proxySpawnOptions = {
  // Required for Windows.
  shell: true,
  stdio: "inherit"
};

module.exports = (
  {
    cmd = "mvn",
    args = ["-f", "server/java/proxy-target-FXPro", "jetty:run"]
  } = {}
) => spawn(cmd, args, proxySpawnOptions);
