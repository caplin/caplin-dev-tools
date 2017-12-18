const configureBundleEntryPoint = require("../entry");
const { BASE_WEBPACK_CONFIG } = require("../config");
const { expect } = require("chai");
const { join } = require("path");

describe("Webpack config app entry tests.", () => {
  it("adds 'entry' property to webpack config when variant is defined.", entryAdded => {
    const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);
    const variant = "main";
    const basePath = "./";

    const reactErrorOverlay = require.resolve("react-error-overlay");
    const entryFile = `index-${variant}.js`;
    const appEntryPoint = join(basePath, "src", entryFile);

    configureBundleEntryPoint(variant, webpackConfig, basePath);

    expect(webpackConfig).to.have.property("entry");
    expect(webpackConfig.entry[0]).to.equal(reactErrorOverlay);
    expect(webpackConfig.entry[1]).to.equal(appEntryPoint);

    entryAdded();
  });

  it("adds 'entry' property to webpack config when variant is undefined.", entryAdded => {
    const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);
    const variant = undefined;
    const basePath = "./";

    const reactErrorOverlay = require.resolve("react-error-overlay");
    const entryFile = "index.js";
    const appEntryPoint = join(basePath, "src", entryFile);

    configureBundleEntryPoint(variant, webpackConfig, basePath);

    expect(webpackConfig).to.have.property("entry");
    expect(webpackConfig.entry[0]).to.equal(reactErrorOverlay);
    expect(webpackConfig.entry[1]).to.equal(appEntryPoint);

    entryAdded();
  });
});
