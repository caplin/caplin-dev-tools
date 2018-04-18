const { join } = require("path");
const configureOutput = require("../output");
const { BASE_WEBPACK_CONFIG } = require("../config");
const expect = require("chai").expect;

describe("Webpack config app output tests.", () => {
  it("adds an output property to the webpack config object", outputAdded => {
    const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);
    const version = "1.5.4";
    const basePath = "./";

    configureOutput(webpackConfig, version, basePath);

    expect(webpackConfig).to.have.nested.property("output.filename");
    expect(webpackConfig.output.filename).to.equal(`bundle-${version}.js`);

    expect(webpackConfig).to.have.nested.property("output.path");
    expect(webpackConfig.output.path).to.equal(join("build", "dist", "static"));

    expect(webpackConfig).to.have.nested.property("output.publicPath");
    expect(webpackConfig.output.publicPath).to.equal("/static/");

    outputAdded();
  });
});
