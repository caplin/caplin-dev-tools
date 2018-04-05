const logger = require("@caplin/node-logger");
const { createProxyServer } = require("http-proxy");

module.exports = ({ host = "http://localhost", port = "9999" } = {}) => {
  const proxy = createProxyServer({
    target: `${host}:${port}`
  });

  proxy.on("error", (err, req, res) => {
    // Lower status codes aren't necessarily indicating an error. For example
    // redirections shouldn't be logged as errors.
    if (res.statusCode > 499) {
      logger.log({
        label: "express-dev-server/proxy-factory",
        level: "warn",
        message: `Error proxying ${req.path}\n${err.stack}`
      });
    }
  });

  return proxy;
};
