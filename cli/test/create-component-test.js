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
  } catch (e) {
    console.log(e);
  }
};

var initDirectories = function() {
  try {
    fs.mkdirSync(path.resolve("apps"));
    fs.mkdirSync(path.resolve("packages-caplin"));
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
    var expected = "What do you want to name your component:";

    cp.stdout.on("data", data => {
      if (data.indexOf(expected) > -1) {
        prompted();
      }
    });
  });

  it("creates correct files for a component", correctFilesCreated => {
    initDirectories();
    execFile("node", ["./index.js", "create-app", "newapp"]);

    var cp = execFile("node", ["./index.js", "create-component", "NewReactComponent", "react"]);
    var stdOutput;

    cp.stdout.on("data", data => {
      stdOutput += data;

      if (stdOutput.indexOf("Created") > -1) {
        assert.file("NewReactComponent/NewReactComponent.scss");
        assert.file("NewReactComponent/NewReactComponent.js");
        assert.file("NewReactComponent/stories/index.js");
        assert.file("NewReactComponent/__tests__/NewReactComponent-test.js");

        if (
          stdOutput.indexOf("react-component") === -1 &&
          stdOutput.indexOf("New component 'NewReactComponent' created!") !== -1
        ) {
          // last message displayed
          cp.stdout.removeAllListeners("data");
          correctFilesCreated();
        }
      }
    });
  });
});
