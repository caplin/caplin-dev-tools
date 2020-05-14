const AliasesPlugin = require("@caplin/aliases-plugin");

module.exports.BASE_WEBPACK_CONFIG = {
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "@caplin/html-loader",
      },
      {
        test: /\.(cur|eot|gif|jpg|png|svg|ttf|woff|woff2)$/,
        loader: "file-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.xml$/,
        loader: "@caplin/xml-loader",
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    // Empty object required for `aliases` module
    alias: {},
    extensions: [".js", ".ts", ".tsx", ".jsx", ".json"],
  },
  performance: {
    // Turn off performance hint warnings.
    hints: false,
  },
  plugins: [new AliasesPlugin()],
};

module.exports.STATIC_DIR = "static";
