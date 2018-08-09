const { existsSync, renameSync, mkdir } = require("fs");
const { join, parse } = require("path");

const { create } = require("archiver");
const { copySync, createWriteStream, writeFileSync } = require("fs-extra");
const parseArgs = require("minimist");
const rimraf = require("rimraf");
const webpack = require("webpack");

const buildDir = "build";
const distDir = join(buildDir, "dist");
const NO_OP = () => {
  // Called after app is built.
};
const STATIC_DIR = "static";
const warDir = join(buildDir, "exported-wars");

function createWARFiles({ indexPage, metaINFPath, version, webINFPath }) {
  const variant = parseArgs(process.argv.slice(2)).variant;
  const indexFile = indexPage({ variant, version });
  const staticDistDir = join(distDir, `${STATIC_DIR}`);
  const staticFilesDir = join(process.cwd(), `${STATIC_DIR}`);
  const versionedStaticDistDir = join(staticDistDir, "dev");

  // Move the `static` directory into the root of the built app.
  if (existsSync(staticFilesDir)) {
    copySync(staticFilesDir, staticDistDir);
  }

  // Move static files that are in the `dev` directory to one named after the
  // version as they can't be cached if the URL never changes (the version makes
  // the files unique and thus allows them to be safely cached).
  if (existsSync(versionedStaticDistDir)) {
    renameSync(versionedStaticDistDir, join(staticDistDir, version));
  }

  if (existsSync(webINFPath)) {
    copySync(webINFPath, join(distDir, "WEB-INF"));
  }

  if (existsSync(metaINFPath)) {
    copySync(metaINFPath, join(distDir, "META-INF"));
  }

  writeFileSync(join(distDir, "index.html"), indexFile, "utf8");
}

// When we've built the application add any required WAR files.
function createWAR(config) {
  const { buildCallback, version, warName } = config;

  createWARFiles(config);

  // Allows the user of this package to attach their own post build/pre WAR
  // creation script.
  buildCallback({ version });

  mkdir(warDir, () => {
    const archive = create("zip");
    const warWriteStream = createWriteStream(join(warDir, `${warName}.war`));

    archive.directory(distDir, "");
    archive.pipe(warWriteStream);
    archive.finalize();

    console.log("Finished creating", join(warDir, `${warName}.war`));
  });
}

// Called once the webpack build finishes.
function webpackBuildCallback(error, stats, config) {
  const jsonStats = stats.toJson();

  if (error) {
    console.error(error);
  } else if (jsonStats.errors.length > 0) {
    jsonStats.errors.forEach(err => console.error(err));
  } else {
    createWAR(config);
  }
}

// When we've removed the previous `dist` directory build the application.
function rimrafCallback(config) {
  return () => {
    console.log("Running webpack compiler...");
    config.webpackConfig.plugins.push(new webpack.ProgressPlugin());

    webpack(config.webpackConfig, (error, stats) => {
      webpackBuildCallback(error, stats, config);
    });
  };
}

exports.buildDir = buildDir;
exports.distDir = distDir;
exports.warDir = warDir;

exports.deleteBuildDir = function deleteBuildDir(callback) {
  rimraf(buildDir, callback);
};

exports.cleanDistAndBuildWAR = function cleanDistAndBuildWAR(config) {
  const defaultWEBINFPath = join(process.cwd(), "scripts", "WEB-INF");
  const webINFPath = config.webINFPath || defaultWEBINFPath;
  // The default is for META-INF to be in the same directory as WEB-INF.
  const defaultMETAINFPath = join(parse(webINFPath).dir, "META-INF");

  config.buildCallback = config.buildCallback || NO_OP;
  config.metaINFPath = config.metaINFPath || defaultMETAINFPath;
  config.webINFPath = webINFPath;

  // Remove the current `build/dist` directory.
  rimraf(distDir, rimrafCallback(config));
};
