
const testsContext = require.context('../node_modules/' + PACKAGE + '/_test-ut', true, /.*\.js$/);

testsContext.keys().forEach(testsContext);
