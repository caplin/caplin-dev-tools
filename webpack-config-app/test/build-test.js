const { expect } = require("chai");
const {
  STATIC_DIR,
  UGLIFY_OPTIONS,
  BASE_WEBPACK_CONFIG
} = require("../config");
const configureBuildDependentConfig = require("../build");

describe("Webpack config app build tests.", () => {
  it("sets publicPath and plugins properties when isBuild is set to true.", propsSet => {
    let webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);
    webpackConfig.output = {};
    const version = "1.5.4";
    const isBuild = true;
    const definitions = {
      "process.env": {
        "NODE_ENV": "\"production\"",
        VERSION: JSON.stringify(version)
      }
    };

    configureBuildDependentConfig(
      webpackConfig,
      version,
      UGLIFY_OPTIONS,
      isBuild
    );

    expect(webpackConfig.output).to.have.property("publicPath");
    expect(webpackConfig.output.publicPath).to.equal(`${STATIC_DIR}/`);

    expect(webpackConfig).to.have.property("plugins");
    expect(webpackConfig.plugins[1].definitions).to.eql(definitions);
    expect(webpackConfig.plugins[2].options).to.include(UGLIFY_OPTIONS);
    propsSet();
  });

  it("doesn't set publicPath and plugins properties when isBuild is set to false.", propsSet => {
    const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);
    const version = "1.5.4";
    const isBuild = false;

    configureBuildDependentConfig(
      webpackConfig,
      version,
      UGLIFY_OPTIONS,
      isBuild
    );

    expect(webpackConfig).to.eql(Object.assign({}, BASE_WEBPACK_CONFIG));
    propsSet();
  });
});
