"use strict";

const testsContext = require.context(PACKAGE_DIRECTORY, true, /.*_test-ut.*\.js$/);

testsContext.keys().forEach(testsContext);