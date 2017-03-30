/* eslint no-param-reassign: "off" */

const {
  basename,
  join
} = require("path");

const {
  appendModulePatch
} = require("@caplin/patch-loader/patchesStore");
const parseArgs = require("minimist");
const webpack = require("webpack");

const configureBabelLoader = require("./babel");
const configureBundleEntryPoint = require("./entry");
const configureI18nLoading = require("./i18n");
const configureServiceLoader = require("./service");

const {
  sourceMaps,
  variant
} = parseArgs(process.argv.slice(2));
const lifeCycleEvent = process.env.npm_lifecycle_event || "";
const isBuild = lifeCycleEvent === "build";
const isTest = basename(process.argv[1]) === "tests.js" ||
  lifeCycleEvent.startsWith("test");
const BASE_WEBPACK_CONFIG = {
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
      "app-meta": "@caplin/app-meta-loader"
    }
  },
  plugins: []
};
const STATIC_DIR = "static";
const UGLIFY_OPTIONS = {
  exclude: /i18n(.*)\.js/,
  output: {
    comments: false
  },
  compress: {
    warnings: false,
    screw_ie8: true
  }
};

module.exports.UGLIFY_OPTIONS = UGLIFY_OPTIONS;

function configureDevtool(webpackConfig) {
  if (sourceMaps) {
    webpackConfig.devtool = "inline-source-map";
  }
}

function configureBuildDependentConfig(webpackConfig, version, uglifyOptions) {
  if (isBuild) {
    webpackConfig.output.publicPath = `${STATIC_DIR}/`;

    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          VERSION: JSON.stringify(version)
        }
      })
    );

    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin(uglifyOptions)
    );
  } else {
    webpackConfig.output.publicPath = `/${STATIC_DIR}/`;
  }
}

module.exports.webpackConfigGenerator = function webpackConfigGenerator(
  {
    basePath,
    version = "dev",
    i18nFileName = `i18n-${version}.js`,
    uglifyOptions = UGLIFY_OPTIONS
  }
) {
  const configDir = join(basePath, "src", "config");
  // Object.create won't work as webpack only uses enumerable own properties.
  const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);

  webpackConfig.output = {
    filename: `bundle-${version}.js`,
    path: join(basePath, "build", "dist", `${STATIC_DIR}`)
  };

  // `AliasRegistry` requires `alias!$aliases-data` loaded with `alias-loader`.
  webpackConfig.resolve.alias["$aliases-data$"] = join(configDir, "aliases.js");
  // `BRAppMetaService` requires `app-meta!$app-metadata` loaded with
  // `app-meta-loader`.
  webpackConfig.resolve.alias["$app-metadata$"] = join(
    configDir,
    "metadata.js"
  );

  // Module requires are resolved relative to the resource that is requiring
  // them. When symlinking during development modules will not be resolved
  // unless we specify their parent directory.
  webpackConfig.resolve.root = join(basePath, "node_modules");

  // Loaders are resolved relative to the resource they are applied to. So
  // when symlinking packages during development loaders will not be
  // resolved unless we specify the directory that contains the loaders.
  webpackConfig.resolveLoader.root = join(basePath, "node_modules");

  configureBundleEntryPoint(variant, webpackConfig, basePath);
  configureBabelLoader(webpackConfig, basePath);
  configureI18nLoading(webpackConfig, i18nFileName, isTest);
  configureServiceLoader(webpackConfig, isTest);
  configureDevtool(webpackConfig);
  configureBuildDependentConfig(webpackConfig, version, uglifyOptions);

  return webpackConfig;
};
