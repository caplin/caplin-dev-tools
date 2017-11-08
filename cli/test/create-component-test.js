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
    fs.mkdirSync(path.resolve("packages"));
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
        cp.stdout.removeAllListeners("data");
        prompted();
      }
    });
  });

  it("creates correct files for a component in current location", correctFilesCreated => {
    initDirectories();
    execFile("node", ["./index.js", "create-app", "newapp"]);

    var cp = execFile("node", ["./index.js", "create-component", "NewReactComponent", "react",  "./"]);
    var stdOutput;

    cp.stdout.on("data", data => {
      stdOutput += data;
      if (stdOutput.indexOf("Created") > -1) {
        if (
          stdOutput.indexOf("react-component") === -1 &&
          stdOutput.indexOf("New component 'NewReactComponent' created!") !== -1
        ) {
          assert.file("NewReactComponent/NewReactComponent.less");
          assert.file("NewReactComponent/NewReactComponent.js");
          assert.file("NewReactComponent/stories/index.js");
          assert.file("NewReactComponent/__tests__/NewReactComponent-test.js");
          //last message displayed
          cp.stdout.removeAllListeners("data");
          correctFilesCreated();
        }
      }
    });
  });    

  it("creates correct files for a component when adding to src", correctFilesCreated => {
    initDirectories();
    execFile("node", ["./index.js", "create-app", "newapp2"]);

    var cp = execFile("node", ["./index.js", "create-component", "NewReactComponent", "react",  "apps/newapp2/src"]);
    var stdOutput;

    cp.stdout.on("data", data => {
      stdOutput += data;
      if (stdOutput.indexOf("Created") > -1) {
        if (
          stdOutput.indexOf("react-component") === -1 &&
          stdOutput.indexOf("New component 'NewReactComponent' created!") !== -1
        ) {
          assert.file("apps/newapp2/src/NewReactComponent/NewReactComponent.less");
          assert.file("apps/newapp2/src/NewReactComponent/NewReactComponent.js");
          assert.file("apps/newapp2/src/NewReactComponent/stories/index.js");
          assert.file("apps/newapp2/src/NewReactComponent/__tests__/NewReactComponent-test.js");
          //last message displayed
          cp.stdout.removeAllListeners("data");
          correctFilesCreated();
        }
      }
    });
  });
});
