const AliasesPlugin = require("@caplin/aliases-plugin");
const { appendModulePatch } = require("@caplin/patch-loader/patchesStore");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

module.exports.BASE_WEBPACK_CONFIG = {
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "@caplin/html-loader"
      },
      {
        test: /\.(gif|jpg|png|svg|woff|woff2)$/,
        loader: "file-loader"
      },
      {
        test: /\.js$/,
        loader: "@caplin/patch-loader",
        options: {
          appendModulePatch: appendModulePatch()
        }
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.xml$/,
        loader: "@caplin/xml-loader"
      }
    ]
  },
  resolve: {
    // Empty object required for `aliases` module
    alias: {},
    extensions: [".js", ".json", ".jsx"]
  },
  plugins: [new AliasesPlugin(), new HardSourceWebpackPlugin()]
};

module.exports.STATIC_DIR = "static";

module.exports.UGLIFY_OPTIONS = {
  exclude: /i18n(.*)\.js/
};
