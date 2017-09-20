const notFound = require("@caplin/express-dev-server/not-found");
const server = require("@caplin/express-dev-server/server");
const proxyFactory = require("@caplin/express-dev-server/proxy-factory");
const resources = require("@caplin/express-dev-server/resources");
const spawn = require("child_process").spawn;

const createWebpackConfig = require("../../webpack.config");

const applicationPath = "/{{appName}}";
const appRoot = process.cwd();
const proxy = proxyFactory();
const proxySpawnOptions = {
  // Required for Windows.
  shell: true,
  stdio: "inherit"
};

server({ webpackConfig: createWebpackConfig() })
  .then(app => {
    spawn(
      "mvn",
      ["-f", "server/java/proxy-target/pom.xml", "jetty:run"],
      proxySpawnOptions
    );

    // Resources served from `node_modules` packages.
    resources(applicationPath, app, appRoot);

    // not-found has to be the last registered route handler.
    notFound(app);
  })
  .catch(error => console.log(error));
