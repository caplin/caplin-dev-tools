import 'babel-polyfill';

const testsContext = require.context(PACKAGE_DIRECTORY, true, /.*_test-at.*\.js$/);

testsContext.keys().forEach(testsContext);
