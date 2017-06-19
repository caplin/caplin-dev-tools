#! /usr/bin/env node

const { existsSync, readdirSync, readFileSync, writeFileSync } = require("fs");
const { dirname, join, relative } = require("path");

const { parse: babylonParse } = require("babylon");
const { readJsonSync, writeJsonSync } = require("fs-extra");
const { sync } = require("glob");
const { parse, print, visit } = require("recast");

const babylonParseOptions = {
  sourceType: "module",
  plugins: ["*"]
};
const recastParseOptions = {
  parser: {
    parse: sourceCode => babylonParse(sourceCode, babylonParseOptions)
  }
};

function isAPackageImport(astNode) {
  return (
    astNode.callee.name === "require" && astNode.callee.type === "Identifier"
  );
}

function convertToRelative(importSource, packageName, jsFileDirectory) {
  if (importSource.value.startsWith(`${packageName}/`)) {
    let relativePath = relative(jsFileDirectory, importSource.value);

    if (relativePath.startsWith(".") === false) {
      relativePath = `./${relativePath}`;
    }

    importSource.value = relativePath;
  }
}

function createImportsVisitor(packageName, jsFileDirectory) {
  return {
    visitCallExpression(path) {
      if (isAPackageImport(path.node) && path.value.arguments[0].value) {
        const importSource = path.value.arguments[0];

        convertToRelative(importSource, packageName, jsFileDirectory);
      }

      this.traverse(path);
    },

    visitImportDeclaration(path) {
      convertToRelative(path.value.source, packageName, jsFileDirectory);

      return false;
    }
  };
}

function extractPackagesFromJSFile(jsFile, importsVisitor) {
  try {
    const ast = parse(readFileSync(jsFile, "utf8"), recastParseOptions);

    visit(ast, importsVisitor);
    // write the new ast to the file.
    writeFileSync(jsFile, print(ast).code);
  } catch (err) {
    console.error(`${jsFile} cannot be parsed for package dependencies.`);
    console.error(err);
    console.log("");
  }
}

function removePackageDependency(packageName) {
  const packageJSON = readJsonSync(join(packageName, "package.json"));

  if (packageJSON.dependencies) {
    // clear from the package.json any reference to itself.
    delete packageJSON.dependencies[packageName];
  }

  writeJsonSync(join(packageName, "package.json"), packageJSON, { spaces: 2 });
}

// Run this script from the `packages-caplin` directory.
const packagesToConvert = readdirSync(".").filter(
  name => existsSync(join(name, "converted_library.js")) === false
);

packagesToConvert.forEach(packageName => {
  const packageJSFiles = sync(`${packageName}/**/*.js`, {
    ignore: ["**/node_modules/**"]
  });

  packageJSFiles.forEach(jsFile => {
    extractPackagesFromJSFile(
      jsFile,
      createImportsVisitor(packageName, dirname(jsFile))
    );
  });

  removePackageDependency(packageName);
});

const thirdPartyLibsToConvert = readdirSync(".").filter(name =>
  existsSync(join(name, "converted_library.js"))
);

thirdPartyLibsToConvert.forEach(packageName => {
  const thirdPartyLibPath = join(packageName, "converted_library.js");
  const thirdPartyLib = readFileSync(thirdPartyLibPath, "utf8");
  const safeExport = packageName.replace(/-/g, "_");

  // Using RegExp's didn't work, probably a mistake in the RegExp, as this is
  // throw away code it will do as is.
  writeFileSync(
    thirdPartyLibPath,
    thirdPartyLib
      .replace(
        `window.${safeExport} = typeof require == 'function' && require('${packageName}');`,
        `window.${safeExport} = typeof module !== "undefined" && module.exports;`
      )
      .replace(
        `window.${safeExport} = typeof require == "function" && require("${packageName}");`,
        `window.${safeExport} = typeof module !== "undefined" && module.exports;`
      )
      .replace(
        `window.${safeExport} = require('${packageName}');`,
        `window.${safeExport} = typeof module !== "undefined" && module.exports;`
      )
      .replace(
        `window.${safeExport} = require("${packageName}");`,
        `window.${safeExport} = typeof module !== "undefined" && module.exports;`
      )
  );
  removePackageDependency(packageName);
});
