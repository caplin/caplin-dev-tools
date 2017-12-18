const htmlLoader = require("../index");
const appendingHTMLLoader = require("../append");
const expect = require("chai").expect;

describe("HTML loader tests", () => {
  it("Registers HTML with the HTMLResourceService.", htmlRegistered => {
    const htmlSource =
      "<!DOCTYPE html><html><body><h1>This is a test.</h1></body></html>";
    const jsonStringHTMLTemplate = JSON.stringify(htmlSource);
    const result = htmlLoader(htmlSource);

    expect(result).to.equal(
      `var HTMLResourceService = require('br/AliasRegistry').getClass('br.html-service');HTMLResourceService.registerHTMLFileContents(${jsonStringHTMLTemplate})`
    );

    htmlRegistered();
  });

  it("Tweaks the module source to register the HTML and append it to the document head.", htmlTweaked => {
    const htmlSource =
      "<!DOCTYPE html><html><body><h1>This is a test.</h1></body></html>";
    const jsonStringHTMLTemplate = JSON.stringify(htmlSource);
    const loadedHTML = htmlLoader(htmlSource);
    const result = appendingHTMLLoader(loadedHTML);

    expect(result)
      .to.include("registerAndAppendHTMLFileContents")
      .and.to.not.include("registerHTMLFileContents");

    htmlTweaked();
  });
});
