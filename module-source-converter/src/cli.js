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

// Run this script from the `packages-caplin` directory.
const packagesToConvert = readdirSync(".").filter(
  name => existsSync(join(name, "converted_library.js")) === false
);

packagesToConvert.forEach(packageName => {
  const packageJSFiles = sync(`${packageName}/**/*.js`, {
    ignore: ["**/node_modules/**"]
  });
  const packageJSON = readJsonSync(join(packageName, "package.json"));

  packageJSFiles.forEach(jsFile => {
    extractPackagesFromJSFile(
      jsFile,
      createImportsVisitor(packageName, dirname(jsFile))
    );
  });

  if (packageJSON.dependencies) {
    // clear from the package.json any reference to itself.
    delete packageJSON.dependencies[packageName];
  }

  writeJsonSync(join(packageName, "package.json"), packageJSON, { spaces: 2 });
});
