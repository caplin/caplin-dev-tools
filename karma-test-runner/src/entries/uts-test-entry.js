require("babel-polyfill");
require("../enzyme-adapter");

// The RegExp starts with '.' to filter out files inside `node_modules`
// directories. A testContext module source is in a format like so:
// `./_test-ut/js-test-driver/tests/caplin/alerts/NotificationServiceTest.js`
// While any test inside a `node_modules` directory within the package being
// tested is in a package format like so: `br-test/_test-ut/Test.js`.
const testsContext = require.context(
  PACKAGE_DIRECTORY,
  true,
  /\..*_test-ut.*\.js$/
);

testsContext.keys().forEach(testsContext);
