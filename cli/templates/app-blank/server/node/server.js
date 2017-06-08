const notFound = require("@caplin/express-dev-server/not-found");
const server = require("@caplin/express-dev-server/server");

const createWebpackConfig = require("../../webpack.config");

const app = server({
  webpackConfig: createWebpackConfig()
});

// Has to be the last registered route handler.
notFound(app);
