const notFound = require("@caplin/express-dev-server/not-found");
const resources = require("@caplin/express-dev-server/resources");
const server = require("@caplin/express-dev-server/server");

const createWebpackConfig = require("../../webpack.config");

const app = server({
  webpackConfig: createWebpackConfig()
});
const applicationPath = "/{{appName}}";
const appRoot = process.cwd();

// Resources served from `node_modules` packages.
resources(applicationPath, app, appRoot);

// Has to be the last registered route handler.
notFound(app);
