var path = require("path");
var execFile = require("child_process").execFile;
var rimraf = require("rimraf");
var assert = require("yeoman-assert");
var fs = require("fs");

var cleanDirectories = function() {
  try {
    rimraf.sync(path.resolve("apps"));
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

describe("create-app", () => {
  beforeEach(() => {
    cleanDirectories();
  });

  it("should throw an error if apps and packages-caplin directories are not found", errorThrown => {
    var cp = execFile("node", ["./index.js", "create-app", "newapp"]);
    var stdOutput = "",
      done = false;

    cp.stdout.on("data", data => {
      stdOutput += data;

      if (
        stdOutput.indexOf("Error: 'apps' directory not found.") !== -1 &&
        !done
      ) {
        cp.stdout.removeAllListeners("data");
        done = true;
        errorThrown();
      }
    });
  });

  it("should generate an app folder if apps and packages-caplin directories are found", allFilesCreated => {
    initDirectories();

    var cp = execFile("node", ["./index.js", "create-app", "newapp", "app-blank"]);
    var stdOutput;

    cp.stdout.on("data", data => {
      stdOutput += data;

      if (stdOutput.indexOf("Created") > -1) {
        assert.file("apps/newapp/index.html");
        assert.file("apps/newapp/src/index.js");
        assert.file("apps/newapp/package.json");
        assert.file("apps/newapp/webpack.config.js");
        assert.file("apps/newapp/server/node/server.js");

        if (
          stdOutput.indexOf("Now cd into apps/newapp and run npm install") > -1
        ) {
          // last message displayed
          cp.stdout.removeAllListeners("data");
          allFilesCreated();
        }
      }
    });
  });

it("should generate an app folder with j2ee support if j2ee-app flag is passed", allFilesCreated => {
    initDirectories();

    var cp = execFile("node", ["./index.js", "create-app", "newapp3", "j2ee-app"]);
    var stdOutput;

    cp.stdout.on("data", data => {
      stdOutput += data;

      if (stdOutput.indexOf("Created") > -1) {
        assert.file("apps/newapp3/index.html");
        assert.file("apps/newapp3/src/index.js");
        assert.file("apps/newapp3/package.json");
        assert.file("apps/newapp3/webpack.config.js");
        assert.file("apps/newapp3/server/node/server.js");
        assert.file("apps/newapp3/server/java/proxy-target/pom.xml");
        assert.file("apps/newapp3/server/java/proxy-target/src/main/webapp/WEB-INF/jetty-env.xml");
        assert.file("apps/newapp3/server/java/proxy-target/src/main/webapp/WEB-INF/web.xml");

        if (
          stdOutput.indexOf("Now cd into apps/newapp3 and run npm install") > -1
        ) {
          // last message displayed
          cp.stdout.removeAllListeners("data");
          allFilesCreated();
        }
      }
    });
  });

  it("should prompt for an app name", prompted => {
    initDirectories();

    var cp = execFile("node", ["./index.js", "create-app"]);
    var expected = "What do you want to name your app:";

    cp.stdout.on("data", data => {
      if (data.indexOf(expected) > -1) {
        cp.stdout.removeAllListeners("data");
        prompted();
      }
    });
  });
});
