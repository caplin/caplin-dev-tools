const {
  join
} = require("path");

const AliasesPlugin = require("@caplin/aliases-plugin");
const {
  appendModulePatch
} = require("@caplin/patch-loader/patchesStore");

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
    alias: {
      // We can't dynamically require using the module names in webpack, module
      // names are converted to IDs by webpack.
      "ct-core/BRJSClassUtility$": join(__dirname, "null.js"),
      "br/dynamicRefRequire$": join(__dirname, "null.js")
    },
    extensions: [".js", ".json", ".jsx"]
  },
  plugins: [new AliasesPlugin()],
  resolveLoader: {
    alias: {
      // This alias can be removed by changing the metadata require in CT libs.
      "app-meta": require.resolve("@caplin/app-meta-loader")
    }
  }
};

module.exports.STATIC_DIR = "static";

module.exports.UGLIFY_OPTIONS = {
  exclude: /i18n(.*)\.js/,
  output: {
    comments: false
  },
  compress: {
    warnings: false,
    screw_ie8: true
  }
};

// Change to true for HMR
module.exports.HMR = false;
