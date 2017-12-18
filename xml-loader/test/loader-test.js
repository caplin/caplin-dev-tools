const xmlLoader = require("../index");
const expect = require("chai").expect;

describe("XML loader", () => {
  it("registers XML with the XMLResourceService", registeredXML => {
    const xmlSource = '<?xml version="1.0"><elem>this is a test</elem></xml>';
    const stringXML = JSON.stringify(xmlSource);
    const result = xmlLoader(xmlSource);

    expect(result).to.equal(
      `var XMLResourceService = require('br/AliasRegistry').getClass('br.xml-service');XMLResourceService.registerXMLFileContents(${stringXML})`
    );
    registeredXML();
  });
});
