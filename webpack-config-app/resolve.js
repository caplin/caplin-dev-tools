/* eslint no-param-reassign: "off" */

const {
  join
} = require("path");

module.exports = function configureResolve(webpackConfig, basePath) {
  // Module requires are resolved relative to the resource that is requiring
  // them. When symlinking during development modules will not be resolved
  // unless we specify their parent directory.
  webpackConfig.resolve.root = join(basePath, "node_modules");

  // Loaders are resolved relative to the resource they are applied to. So
  // when symlinking packages during development loaders will not be
  // resolved unless we specify the directory that contains the loaders.
  webpackConfig.resolveLoader.root = join(basePath, "node_modules");
};
