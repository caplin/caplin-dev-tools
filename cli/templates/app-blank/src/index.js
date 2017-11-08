import Example from "./example/Example";
import "./index.less";

console.log(new Example().sayHello());

if (module.hot) {
  module.hot.accept();
}
