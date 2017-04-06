const {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} = require("fs");
const {
  dirname,
  join,
  relative,
  sep
} = require("path");

const {
  load
} = require("cheerio");
const {
  sync
} = require("glob");

const jsGlobOptions = {
  ignore: ["**/config/aliases.js"]
};
const htmlGlobOptions = {
  ignore: [
    "**/config/aliases.js",
    "**/node_modules/**",
    "**/workbench/resources/**"
  ]
};
const templateIDRegExp = /['|"](.*)['|"]/g;

function dirPrefixRemover(prefix) {
  return jsFilePath => jsFilePath.replace(prefix, "");
}

function isRelativePackage() {
  return (
    fileToRequire,
    jsFileDir
    // Are we requiring a properties file from the same package.
  ) => fileToRequire.split("/")[1] === jsFileDir.split("/")[1];
}

function isRelativeApp(applicationName) {
  return fileToRequire => fileToRequire.startsWith(`apps/${applicationName}/`);
}

// Templates can contain references to other templates, find them in the DOM.
function findReferencedTemplateIDs(parsedDOM) {
  const dependentTemplateIDs = new Set();

  parsedDOM.root().find("[data-bind*=template]").each((index, element) => {
    const dataValue = parsedDOM(element).data("bind");
    // Some template names are code to be executed as opposed to a simple string
    // e.g. `template: {name: amount.getTemplateName()}`, we want to skip these.
    const templateNameMatchArray = dataValue.match(
      /.*name\s*:\s*['|"](.*?)['|"]/
    ) ||
      // Some template names are strings instead of being wrapped in an object
      // e.g. `template: 'caplin.orderticket.amount'`.
      dataValue.match(/.*template\s*:\s*['|"](.*?)['|"]/);

    if (templateNameMatchArray) {
      dependentTemplateIDs.add(templateNameMatchArray[1]);
    }
  });

  return dependentTemplateIDs;
}

// Discover the IDs of templates, create and register a `FileInfo` object for
// each ID.
function createTemplateFileInfo(
  parsedDOM,
  templateIDsToFileInfo,
  filePath,
  referencedTemplateIDs
) {
  let warnedAboutLackOfID = false;

  parsedDOM.root().children().each((index, element) => {
    const id = parsedDOM(element).attr("id");

    if (id) {
      templateIDsToFileInfo.set(id, { filePath, referencedTemplateIDs });
    } else if (warnedAboutLackOfID === false) {
      console.warn(`${filePath} has no id in one of its top level DOM nodes.`);
      warnedAboutLackOfID = true;
    }
  });
}

// Read the provided HTML template IDs and register their file location to allow
// `require`s pointing toward the file that contains them to be added.
function registerTemplateIDs(htmlFilePaths, templateIDsToFileInfo) {
  htmlFilePaths.forEach(htmlFilePath => {
    const htmlFile = readFileSync(htmlFilePath, "utf8");
    const parsedDOM = load(htmlFile);
    const referencedTemplateIDs = findReferencedTemplateIDs(parsedDOM);

    createTemplateFileInfo(
      parsedDOM,
      templateIDsToFileInfo,
      htmlFilePath,
      referencedTemplateIDs
    );
  });
}

function shouldFileBeSkipped(packageJSFilePath, applicationName) {
  // Don't add requires to `aliasProviders.js` modules as they are run by node
  // and it can't hande HTML requires.
  if (packageJSFilePath.endsWith("aliasProviders.js")) {
    return false;
  }

  // Skip these files in the BRJS repo conversion.
  if (
    applicationName === "it-app" &&
    (packageJSFilePath.endsWith("ServiceRegistryClass.js") ||
      packageJSFilePath.endsWith("Errors.js") ||
      packageJSFilePath.endsWith("Translator.js"))
  ) {
    return false;
  }

  return true;
}

// If `possibleTemplateID` is a template ID, contains one or constructs what
// appears to be one add it to list of discovered template IDs.
function addMatchIfItsATemplateID(
  possibleTemplateID,
  templateIDsToFileInfo,
  discoveredTemplateIDs
) {
  if (templateIDsToFileInfo.has(possibleTemplateID)) {
    discoveredTemplateIDs.add(possibleTemplateID);
  } else if (possibleTemplateID !== "") {
    let matchArray = [];

    for (const [templatedID] of templateIDsToFileInfo) {
      if (possibleTemplateID.includes(templatedID)) {
        discoveredTemplateIDs.add(templatedID);
      } else if (
        (matchArray = possibleTemplateID.match(
          /(.+?)['|"]\s*\+.*\+\s*['|"](.+)/
        )) !== null
      ) {
        // This block deals with code that computes the template ID, such as the
        // code below.
        // `'caplinx.fxexecution.fxtile.metal_' + sCurrentPanel + '_setup';`.
        if (
          templatedID.startsWith(matchArray[1]) &&
          templatedID.endsWith(matchArray[2])
        ) {
          console.log(
            `${possibleTemplateID} generates a require for the template with ID ${templatedID}`
          );

          discoveredTemplateIDs.add(templatedID);
        }
      }
    }
  }
}

// For `templateID` add any referenced templates (and their referenced
// templates) to `discoveredTemplateIDs`.
function addReferencedTemplates(
  templateID,
  discoveredTemplateIDs,
  templateIDsToFileInfo
) {
  const templateFileInfo = templateIDsToFileInfo.get(templateID);
  // The template `caplinx.motf.orderticket.message-overlay` is referenced in
  // `cps-motf` via `MotfConfirmationBootstrap` but that's wrong, you shouldn't
  // have library templates directly depend on application template IDs. Given
  // we add package to package requires first there will not be any application
  // template knowledge in the converter so use an empty Array.
  if (templateFileInfo === undefined) {
    console.log(
      `
    Couldn't fine template file info for ${templateID}.
    It might be an application level template incorrectly referenced at the
    package level.
    `
    );
  }
  const referencedTemplateIDs = templateFileInfo
    ? templateFileInfo.referencedTemplateIDs
    : [];

  referencedTemplateIDs.forEach(referencedTemplateID => {
    if (discoveredTemplateIDs.has(referencedTemplateID) === false) {
      discoveredTemplateIDs.add(referencedTemplateID);
      // Recurse to find templates required by the transitive dependency.
      addReferencedTemplates(
        referencedTemplateID,
        discoveredTemplateIDs,
        templateIDsToFileInfo
      );
    }
  });
}

// Transform the HTML file path into a module require path.
function resolveHTMLRequirePath(
  htmlFilePath,
  jsFilePath,
  isRelative,
  removeDirPrefix
) {
  const jsFileDir = dirname(jsFilePath);
  let requirePath = removeDirPrefix(htmlFilePath);

  if (isRelative(htmlFilePath, jsFileDir)) {
    requirePath = relative(jsFileDir, htmlFilePath)
      // Convert Windows separator to Unix style for module URIs.
      .split(sep)
      .join("/");

    // `relative` returns file paths, which don't need to start with `./` if
    // they are relative, module paths do though so add `./` if they don't
    // start with '../'.
    if (requirePath.startsWith("..") === false) {
      requirePath = `./${requirePath}`;
    }
  }

  return requirePath;
}

// Scans the provided file to find HTML template IDs used within and returns the
// file paths to the used templates.
function discoverHTMLFilePaths(jsFilePath, templateIDsToFileInfo) {
  const discoveredHTMLFilePaths = new Set();
  const discoveredTemplateIDs = new Set();
  const jsFile = readFileSync(jsFilePath, "utf8");
  let matchArray = [];

  while ((matchArray = templateIDRegExp.exec(jsFile)) !== null) {
    addMatchIfItsATemplateID(
      matchArray[1],
      templateIDsToFileInfo,
      discoveredTemplateIDs
    );
  }

  discoveredTemplateIDs.forEach(templateID => {
    addReferencedTemplates(
      templateID,
      discoveredTemplateIDs,
      templateIDsToFileInfo
    );
  });

  discoveredTemplateIDs.forEach(templateID => {
    const templateFileInfo = templateIDsToFileInfo.get(templateID);

    // The template `caplinx.motf.orderticket.message-overlay` is referenced in
    // `cps-motf` via `MotfConfirmationBootstrap` but that's wrong, you
    // shouldn't have library templates directly depend on application template
    // IDs. Given we add package to package requires first there will not be any
    // application template file info in the converter so skip.
    if (templateFileInfo) {
      discoveredHTMLFilePaths.add(templateFileInfo.filePath);
    }
  });

  return [...discoveredHTMLFilePaths];
}

// Given a list of JS file paths add requires for any template IDs found in a
// file.
function addRequires(
  templateIDsToFileInfo,
  jsFilePaths,
  isRelative,
  removeDirPrefix
) {
  jsFilePaths.map(jsFilePath => {
    const requireStatements = discoverHTMLFilePaths(
      jsFilePath,
      templateIDsToFileInfo
    )
      .map(htmlFilePath =>
        resolveHTMLRequirePath(
          htmlFilePath,
          jsFilePath,
          isRelative,
          removeDirPrefix
        ))
      .map(requirePath => `require('${requirePath}');`)
      .join("\n");

    if (requireStatements) {
      const jsFile = readFileSync(jsFilePath);

      writeFileSync(jsFilePath, `${requireStatements}\n${jsFile}`);
    }
  });
}

module.exports.injectHTMLRequires = function injectHTMLRequires(
  { applicationName, packagesDirName }
) {
  const appJSFilePaths = sync(
    `apps/${applicationName}/src/**/*.js`,
    jsGlobOptions
  );
  const appHTMLFilePaths = sync(
    `apps/${applicationName}/src/**/{_resources,_resources-test-[au]t}/**/*.html`,
    htmlGlobOptions
  );
  const devPackages = readdirSync(packagesDirName)
    .filter(packageDir =>
      statSync(join(packagesDirName, packageDir)).isDirectory())
    .filter(
      packageDir =>
        existsSync(
          join(packagesDirName, packageDir, "thirdparty-lib.manifest")
        ) === false
    );
  const packageJSFilePaths = sync(
    `${packagesDirName}/{${devPackages.join()}}/**/*.js`
  ).filter(packageJSFilePath =>
    shouldFileBeSkipped(packageJSFilePath, applicationName));
  const packageHTMLFilePaths = sync(
    `${packagesDirName}/**/{_resources,_resources-test-[au]t}/**/*.html`,
    htmlGlobOptions
  );
  const stripPackagePrefix = dirPrefixRemover(`${packagesDirName}/`);
  const templateIDsToFileInfo = new Map();

  // Firstly add package to package requires.
  registerTemplateIDs(packageHTMLFilePaths, templateIDsToFileInfo);
  addRequires(
    templateIDsToFileInfo,
    packageJSFilePaths,
    isRelativePackage(),
    stripPackagePrefix
  );
  // Then add requires to app source code.
  registerTemplateIDs(appHTMLFilePaths, templateIDsToFileInfo);
  addRequires(
    templateIDsToFileInfo,
    appJSFilePaths,
    isRelativeApp(applicationName),
    stripPackagePrefix
  );
};
