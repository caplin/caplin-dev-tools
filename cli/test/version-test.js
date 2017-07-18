
var execFile = require("child_process").execFile;
var assert = require("yeoman-assert");
var pkg = require("../package.json");

describe("version", () => {
  it("should display correct version", (isDisplayed) => {
    var cp = execFile("node", ["./index.js", "version"]);

    cp.stdout.on("data", (data) => {
      console.log(data);
      var expected = pkg.version;
      assert.equal(data.replace(/\r\n|\n/g, ""), expected);
      cp.stdout.removeAllListeners("data");
      isDisplayed();
    });
  });
});
