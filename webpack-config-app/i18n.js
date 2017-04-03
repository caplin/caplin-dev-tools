const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function configureI18nLoading(
  webpackConfig,
  i18nFileName,
  isTest
) {
  const i18nModulesRule = {
    test: /\.properties$/
  };

  if (isTest) {
    i18nModulesRule.loader = "@caplin/i18n-loader/inline";
  } else {
    const i18nExtractTextPlugin = new ExtractTextPlugin({
      allChunks: true,
      filename: i18nFileName
    });
    const i18nExtractingLoader = i18nExtractTextPlugin.extract([
      "raw-loader",
      "@caplin/i18n-loader"
    ]);

    i18nModulesRule.use = i18nExtractingLoader;
    webpackConfig.plugins.push(i18nExtractTextPlugin);
  }

  webpackConfig.module.rules.push(i18nModulesRule);
};
