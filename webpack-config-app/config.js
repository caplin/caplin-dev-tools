const {
  join
} = require("path");

const {
  appendModulePatch
} = require("@caplin/patch-loader/patchesStore");

module.exports.BASE_WEBPACK_CONFIG = {
  module: {
    loaders: [
      {
        test: /\.html$/,
        loaders: ["@caplin/html-loader"]
      },
      {
        test: /\.(gif|jpg|png|svg|woff|woff2)$/,
        loader: "file-loader"
      },
      {
        test: /\.js$/,
        loader: "@caplin/patch-loader"
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.xml$/,
        loader: "@caplin/xml-loader"
      }
    ]
  },
  patchLoader: appendModulePatch(),
  resolve: {
    alias: {
      "ct-core/BRJSClassUtility$": join(__dirname, "null.js"),
      "br/dynamicRefRequire$": join(__dirname, "null.js")
    },
    extensions: ["", ".js", ".jsx"]
  },
  resolveLoader: {
    alias: {
      alias: "@caplin/alias-loader",
      "app-meta": "@caplin/app-meta-loader",
      service: "@caplin/service-loader"
    }
  },
  plugins: []
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
