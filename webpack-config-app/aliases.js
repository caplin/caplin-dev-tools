const { join } = require("path");

module.exports = function configureAliases(webpackConfig, basePath) {
  const configDir = join(basePath, "src", "config");

  // `AliasRegistry` requires `alias!$aliases-data`.
  webpackConfig.resolve.alias["$aliases-data$"] = join(configDir, "aliases.js");
};
