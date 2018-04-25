const AliasesPlugin = require("@caplin/aliases-plugin");
const { appendModulePatch } = require("@caplin/patch-loader/patchesStore");

module.exports.BASE_WEBPACK_CONFIG = {
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "@caplin/html-loader"
      },
      {
        test: /\.(eot|gif|jpg|png|svg|ttf|woff|woff2)$/,
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
  performance: {
    // Turn off performance hint warnings.
    hints: false
  },
  plugins: [new AliasesPlugin()]
};

module.exports.STATIC_DIR = "static";

module.exports.UGLIFY_OPTIONS = {
  exclude: /i18n(.*)\.js/
};
