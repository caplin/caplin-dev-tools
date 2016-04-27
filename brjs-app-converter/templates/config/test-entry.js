
const testsContext = require.context('../libs/' + PACKAGE, true, /.*_test-[ua]t.*\.js$/);

testsContext.keys().forEach(testsContext);
