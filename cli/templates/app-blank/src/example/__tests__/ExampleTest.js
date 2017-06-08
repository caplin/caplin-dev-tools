import Example from "../Example";
import chai from "chai";

const assert = chai.assert;

describe("Testing Example class", () => {
  let exampleClass = null;

  beforeEach(() => {
    exampleClass = new Example();
  });

  afterEach(() => {
    exampleClass = null;
  });

  it("should say hello", () => {
    assert.equal(
      exampleClass.sayHello(),
      "Hello world!",
      "The world did not receive a welcoming hello."
    );
  });
});
