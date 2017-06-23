import React from "react";
import { shallow, mount, render } from "enzyme";

import {{componentName}} from "../react-component";

describe("example tests", function() {
  test("should have correct header when passed owner with props", () => {
    const wrapper = shallow(<{{componentName}} owner="Bob" />);
    const headerText = wrapper.find(".{{componentName}}-heading").first().text();
    expect(headerText).toEqual("This {{componentName}} Component belongs to Bob");
  });
  test("should have count of zero when first loaded", () => {
    const wrapper = shallow(<{{componentName}} />);
    const counterText = wrapper.find(".{{componentName}}-counter").first().text();
    expect(counterText).toEqual("count:0");
  });
  test("should update counter when button pressed", () => {
    const wrapper = shallow(<{{componentName}} />);
    wrapper.find("button").first().simulate("click");
    const counterText = wrapper.find(".{{componentName}}-counter").first().text();
    expect(counterText).toEqual("count:1");
  });
});
