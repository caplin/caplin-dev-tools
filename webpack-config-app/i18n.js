const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function configureI18nLoading(
  webpackConfig,
  i18nFileName,
  isTest
) {
  const i18nLoaderConfig = {
    test: /\.properties$/
  };

  if (isTest) {
    i18nLoaderConfig.loader = "@caplin/i18n-loader/inline";
  } else {
    const i18nExtractorPlugin = new ExtractTextPlugin(i18nFileName, {
      allChunks: true
    });

    i18nLoaderConfig.loader = i18nExtractorPlugin.extract([
      "raw-loader",
      "@caplin/i18n-loader"
    ]);
    webpackConfig.plugins.push(i18nExtractorPlugin);
  }

  webpackConfig.module.loaders.push(i18nLoaderConfig);
};
