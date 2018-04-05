const logger = require("@caplin/node-logger");

const NOT_FOUND_CODE = 404;

module.exports = application => {
  // Log a warning for any request that doesn't match a route. This route
  // handler has to be the last route handler registered otherwise it will
  // capture/match all requests.
  application.use((req, res) => {
    const notFoundWarning = `Resource for ${req.url} not found.`;

    logger.log({
      label: "express-dev-server/not-found",
      level: "warn",
      message: notFoundWarning
    });

    res.status(NOT_FOUND_CODE).send(notFoundWarning);
  });
};
