// These two imports are replaced with individual imports based on the
// `@babel/preset-env` `targets` values.
import "core-js/stable";
import "regenerator-runtime/runtime";

// When using a reporter that outputs browser logs missing I18n token warnings
// may overwhelm the other output and make it harder to spot useful logs.
window.suppressI18nWarnings = true;

// The RegExp starts with '.' to filter out files inside `node_modules`
// directories. A testContext module source is in a format like so:
// `./_test-ut/js-test-driver/tests/caplin/alerts/NotificationServiceTest.js`
// While any test inside a `node_modules` directory within the package being
// tested is in a package format like so: `br-test/_test-ut/Test.js`.
const testsContext = require.context(
  PACKAGE_DIRECTORY,
  true,
  /\..*_test-at.*\.js$/
);

testsContext.keys().forEach(testsContext);
