var path = require("path");
var execFile = require("child_process").execFile;
var rimraf = require("rimraf");
var assert = require("yeoman-assert");
var fs = require("fs");

var cleanDirectories = function() {
  try {
    rimraf.sync(path.resolve("apps"));
    rimraf.sync(path.resolve("packages"));
    rimraf.sync(path.resolve("packages-caplin"));
    rimraf.sync(path.resolve("test-folder-react-component"));
    rimraf.sync(path.resolve("test-folder-package-name"));
  } catch (e) {
    console.log(e);
  }
};

var initDirectories = function() {
  try {
    fs.mkdirSync(path.resolve("apps"));
    fs.mkdirSync(path.resolve("packages"));
    fs.mkdirSync(path.resolve("packages-caplin"));
    fs.mkdirSync(path.resolve("test-folder-react-component"));
    fs.mkdirSync(path.resolve("test-folder-package-name"));
  } catch (e) {
    console.log(e);
  }
};

describe("create-component", () => {
  beforeEach(() => {
    cleanDirectories();
  });

  it("should prompt for a component name", prompted => {
    initDirectories();
    var cp = execFile("node", ["./index.js", "create-component"]);

    cp.stdout.on("data", data => {
      if (/What do you want to name your component/g.test(data)) {
        cp.stdout.removeAllListeners("data");
        prompted();
      }
    });
  });

  it("creates correct files for a component in current location", correctFilesCreated => {
    initDirectories();

    execFile(
      "node",
      ["./index.js", "create-component", "NewReactComponent", "react", "./"],
      (err, stdout, stderr) => {
        if (err) throw err;

        if (/Created/g.test(stdout)) {
          if (
            !/react-component/g.test(stdout) &&
            /New component 'NewReactComponent' created!/g.test(stdout)
          ) {
            let filesToCheck = [
              "NewReactComponent/NewReactComponent.js",
              "NewReactComponent/stories/index.js",
              "NewReactComponent/__tests__/NewReactComponent-test.js",
              "NewReactComponent/NewReactComponent.less"
            ];
            assert.file(filesToCheck);
            correctFilesCreated();
          }
        }
      }
    );
  });

  it("creates correct files for a component when adding to src", correctFilesCreated => {
    initDirectories();
    execFile("node", ["./index.js", "create-app", "newapp2"]);

    execFile(
      "node",
      [
        "./index.js",
        "create-component",
        "NewReactComponent",
        "react",
        "apps/newapp2/src"
      ],
      (err, stdout, stderr) => {
        if (err) throw err;

        if (/Created/g.test(stdout)) {
          if (
            !/react-component/g.test(stdout) &&
            /New component 'NewReactComponent' created!/g.test(stdout)
          ) {
            let filesToCheck = [
              "apps/newapp2/src/NewReactComponent/NewReactComponent.js",
              "apps/newapp2/src/NewReactComponent/stories/index.js",
              "apps/newapp2/src/NewReactComponent/__tests__/NewReactComponent-test.js",
              "apps/newapp2/src/NewReactComponent/NewReactComponent.less"
            ];
            assert.file(filesToCheck);
            correctFilesCreated();
          }
        }
      }
    );
  });

  it('creates component correctly in a directory containing the string "react-component"', correctFilesCreated => {
    initDirectories();
    execFile(
      "node",
      [
        "./index.js",
        "create-component",
        "NewReactComponent",
        "react",
        "test-folder-react-component"
      ],
      (err, stdout, stderr) => {
        if (err) throw err;

        if (/Created/g.test(stdout)) {
          if (
            /react-component/g.test(stdout) &&
            /New component 'NewReactComponent' created!/g.test(stdout)
          ) {
            let filesToCheck = [
              "test-folder-react-component/NewReactComponent/NewReactComponent.js",
              "test-folder-react-component/NewReactComponent/stories/index.js",
              "test-folder-react-component/NewReactComponent/__tests__/NewReactComponent-test.js",
              "test-folder-react-component/NewReactComponent/NewReactComponent.less"
            ];
            assert.file(filesToCheck);
            correctFilesCreated();
          }
        }
      }
    );
  });

  it('creates component correctly in a directory containing the string "package-name"', correctFilesCreated => {
    initDirectories();
    execFile(
      "node",
      [
        "./index.js",
        "create-component",
        "NewReactComponent",
        "react",
        "test-folder-package-name"
      ],
      (err, stdout, stderr) => {
        if (err) throw err;

        if (/Created/g.test(stdout)) {
          if (
            /package-name/g.test(stdout) &&
            /New component 'NewReactComponent' created!/g.test(stdout)
          ) {
            let filesToCheck = [
              "test-folder-package-name/NewReactComponent/NewReactComponent.js",
              "test-folder-package-name/NewReactComponent/stories/index.js",
              "test-folder-package-name/NewReactComponent/__tests__/NewReactComponent-test.js",
              "test-folder-package-name/NewReactComponent/NewReactComponent.less"
            ];
            assert.file(filesToCheck);
            correctFilesCreated();
          }
        }
      }
    );
  });
});
