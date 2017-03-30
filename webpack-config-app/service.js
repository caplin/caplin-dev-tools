module.exports = function configureServiceLoader(webpackConfig, isTest) {
  const loaderAliases = webpackConfig.resolveLoader.alias;

  if (isTest) {
    loaderAliases.service = "@caplin/service-loader/cache-deletion-loader";
  } else {
    loaderAliases.service = "@caplin/service-loader";
  }
};
