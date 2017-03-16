const { readFileSync } = require("fs");
const { join } = require("path");

const calculateVersion = require("@caplin/versioning");
const { cleanDistAndBuildWAR } = require("@caplin/build-tasks");

const config = require("../webpack.config");

const version = calculateVersion(process.env.npm_package_version);

function getIndexPage() {
  return readFileSync(join(__dirname, "..", "index.html"), "utf8");
}

cleanDistAndBuildWAR({
  indexPage: getIndexPage,
  version,
  warName: "untitled",
  webpackConfig: config
});
