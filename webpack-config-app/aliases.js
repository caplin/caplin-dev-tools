/* eslint no-param-reassign: "off" */

const {
  join
} = require("path");

module.exports = function configureAliases(webpackConfig, basePath) {
  const configDir = join(basePath, "src", "config");

  // `AliasRegistry` requires `alias!$aliases-data` loaded with `alias-loader`.
  webpackConfig.resolve.alias["$aliases-data$"] = join(configDir, "aliases.js");
  // `BRAppMetaService` requires `app-meta!$app-metadata` loaded with
  // `app-meta-loader`.
  webpackConfig.resolve.alias["$app-metadata$"] = join(
    configDir,
    "metadata.js"
  );
};
