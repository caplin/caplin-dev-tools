import Example from "../Example";

describe("Testing Example class", () => {
  let exampleClass = null;

  beforeEach(() => {
    exampleClass = new Example();
  });

  afterEach(() => {
    exampleClass = null;
  });

  test("it should say hello", () => {
     expect(exampleClass.sayHello()).toBe("Hello world!");
  });
});
