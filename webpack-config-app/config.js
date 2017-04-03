const {
  join
} = require("path");

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
  plugins: [],
  resolveLoader: {
    alias: {
      alias: "@caplin/alias-loader",
      "app-meta": "@caplin/app-meta-loader",
      service: "@caplin/service-loader"
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
