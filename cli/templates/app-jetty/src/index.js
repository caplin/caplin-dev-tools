import Example from "./example/Example";
import "./index.scss";

console.log(new Example().sayHello());

if (module.hot) {
  module.hot.accept();
}
