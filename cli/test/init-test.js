
var path = require("path");
var execFile = require("child_process").execFile;
var assert = require("yeoman-assert");

describe("init", () => {
  it("should display an error when running in non empty directory", (
    isDisplayed
  ) => {
    var cp = execFile("node", ["./index.js", "init"]);
    var expected = "needs to be run in an empty directory";

    cp.stdout.on("data", (data) => {
      if (data.indexOf(expected) > -1) {
        cp.stdout.removeAllListeners("data");
        isDisplayed();
      }
    });
  });

  it("should initialise the workspace", (isDisplayed) => {
    var cp = execFile("node", ["./index.js", "init"]);
    var expected = "needs to be run in an empty directory";

    cp.stdout.on("data", (data) => {
      if (data.indexOf(expected) > -1) {
        cp.stdout.removeAllListeners("data");
        isDisplayed();
      }
    });
  });
});
