"use strict";

const testsContext = require.context(PACKAGE_DIRECTORY, true, /.*_test-[ua]t.*\.js$/);

testsContext.keys().forEach(testsContext);