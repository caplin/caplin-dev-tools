/*REPLACE*/

(function(window) {

    /**
     * Invoked before all the tests are run, it reports complete number of tests.
     */
    function beforeRun(karma) {
        var config = jstestdriver.testCaseManager.getDefaultTestRunsConfiguration();
        var total = 0;
        for (var i = 0; i < config.length; i++) {
            var configItem = config[i];
            total += configItem.tests_.length;
        }
        karma.info({
            // count number of tests in each of the modules
            total: total
        });
    }

    /**
     * Invoked after all the tests are finished running with unit tests runner
     * as a first parameter. `window.__coverage__` is provided by Karma. This function
     * basically notifies Karma that unit tests runner is done.
     */
    function afterRun(karma) {
        karma.complete({
            coverage: window.__coverage__
        });
    }

    /**
     * Invoked after each test, used to provide Karma with feedback for each of the tests
     */
    function afterTest(karma, testResult) {
        var log = [];
        if (testResult.log != "")
            log.push(testResult.log);
        if (testResult.message != "" && testResult.message != "[]") {
            var error = JSON.parse(testResult.message)[0];
            log.push(error.name + ": " + error.message);
            log.push(error.stack);
        }
        karma.result({
            description: testResult.testName,
            suite: [testResult.testCaseName] || [],
            success: testResult.result === "passed",
            log: log,
            time: testResult.time
        });
    }

    const fnNameMatchRegex = /^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^\(\s\/]*)\s*/;

    function getFunctionName(func) {
      if (typeof func.name === "string") {
        return func.name;
      }

      // You shouldn't reach here as our test entry points import core-js which
      // polyfills Function.name...but just in case.
      const match = func.toString().match(fnNameMatchRegex);

      return match && match[1];
    }

    function canRunJasmineStart(jasmineStart) {
      if (getFunctionName(jasmineStart) === "UNIMPLEMENTED_START") {
        return false;
      }

      const jasmineLoaded = window.jasmine !== undefined;

      if (jasmineLoaded && window.jasmine.caplinJasmine) {
        return false;
      }

      return jasmineLoaded;
    }

    /**
     * Returns the function needed to start running the tests.
     *
     * @param  {Object} karma Karma runner instance
     */
    function createStartFn(karma) {
        const jasmineStart = karma.start;
        
        jstestdriver.console = new jstestdriver.Console();
        jstestdriver.config.createRunner(jstestdriver.config.createStandAloneExecutor,
            jstestdriver.plugins.pausingRunTestLoop);

        return function () {
            beforeRun(karma);
            jstestdriver.testRunner.runTests(jstestdriver.testCaseManager.getDefaultTestRunsConfiguration(),
                function(test) {
                    afterTest(karma, test);
                }, function() {
                    // If Jasmine is being used for some of the tests run them
                    // after the JSTestDriver tests and don't notify Karma of
                    // completion as the Jasmine adapter will do so. Some ATs
                    // load the Caplin Jasmine via GwtTestRunner so skip them as
                    // they are registered as JSTestDriver tests and don't use
                    // the npm Jasmine adapter.
                    if (canRunJasmineStart(jasmineStart)) {
                        jasmineStart();
                    } else {
                        afterRun(karma);
                    }
                }, true );
        };
    }

    /**
     * Returned function is used for logging by Karma
     */
    function createDumpFn(karma, serialize) {
        return function () {
            karma.info({ dump: [].slice.call(arguments) });
        };
    }

    window.__karma__.start = createStartFn(window.__karma__);
    window.dump = createDumpFn(window.__karma__, function (value) {
        return value;
    });
})(window);