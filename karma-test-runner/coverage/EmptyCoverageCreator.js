const istanbulInstrumentor = require("istanbul-lib-instrument");
const fs = require("fs-extra");
const instrumentor = istanbulInstrumentor.createInstrumenter({
  esModules: true
});
const { join, resolve, extname, basename } = require("path");

function createBlankCoverage(
  packages,
  validPks,
  includePackages,
  dependencies
) {
  const directoriesToCreateCoverageFor = [];
  if (packages.length > 0) {
    directoriesToCreateCoverageFor.push(...validPks);
  } else {
    if (includePackages) {
      directoriesToCreateCoverageFor.push(...dependencies);
    }

    if (fs.existsSync("./src")) {
      directoriesToCreateCoverageFor.push("./src");
    }
  }

  directoriesToCreateCoverageFor.forEach(pkg => {
    createCoverageForDirectory(pkg);
  });
}

function isSecondLevelNodeModule(directory) {
  const matched = directory.match(/node_modules/g);
  return matched && matched.length > 1;
}

function getFileNamesRecursive(directory) {
  if (directory.includes("test") || isSecondLevelNodeModule(directory)) {
    return [];
  }
  const files = fs.readdirSync(directory);
  const fileNamesList = [];

  files.forEach(file => {
    const filePath = join(directory, file);
    const fileStats = fs.statSync(filePath);
    if (fileStats.isDirectory()) {
      const fileNames = getFileNamesRecursive(filePath);
      fileNamesList.push(...fileNames);
    } else {
      const resolvedPath = resolve(filePath);
      if (extname(resolvedPath) === ".js") {
        fileNamesList.push(resolvedPath);
      }
    }
  });

  return fileNamesList;
}

function createCoverageForDirectory(directory) {
  if (!fs.existsSync("./coverage")) {
    fs.mkdirSync("./coverage");
  }
  const fileNames = getFileNamesRecursive(directory);

  createCoverageFile(
    fileNames,
    `./coverage/empty-coverage-${basename(directory)}.json`
  );
}

function createCoverageFile(listOfFiles, fileName) {
  const coverage = getCoverageForFiles(listOfFiles);
  fs.writeFileSync(fileName, JSON.stringify(coverage));
}

function getCoverageForFiles(listOfFiles) {
  const coverage = {};
  listOfFiles.forEach(fileName => {
    coverage[fileName] = createEmptyCoverageForFile(fileName);
  });

  return coverage;
}

function getCoverageSchema(coverageString) {
  const parts = coverageString.split('"');

  let coverageSchemaIndex = NaN;

  parts.forEach((part, index) => {
    if (part.includes("_coverageSchema")) {
      coverageSchemaIndex = index + 1;
    }
  });

  if (isNaN(coverageSchemaIndex)) {
    throw `coverage string was missing _coverageSchema ${coverageString}`;
  }

  return parts[coverageSchemaIndex];
}

function createEmptyCoverageForFile(fileName) {
  const file = fs.readFileSync(fileName, "utf8");

  try {
    const coverageString = instrumentor.instrumentSync(file, fileName);
    const coverage = istanbulInstrumentor.readInitialCoverage(coverageString);

    return {
      ...coverage.coverageData,
      hash: coverage.hash,
      _coverageSchema: getCoverageSchema(coverageString)
    };
  } catch (e) {
    console.log(
      `file with filename : ${fileName} did not parse correctly.\n\n error was: \n\n ${e}`
    );
  }
}
module.exports.createBlankCoverage = createBlankCoverage;
