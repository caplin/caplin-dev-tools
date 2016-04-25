
const testsContext = require.context('../node_modules/' + PACKAGE, true, /.*_test-[ua]t.*\.js$/);

testsContext.keys().forEach(testsContext);
