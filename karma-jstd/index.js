const jstdAdapter = require.resolve(
  "@caplin/karma-jstd-adapter",
  "jstd-adapter.js"
);

module.exports = function configurePackageTestDatatype(testDatatype) {
  const currentKarmaFiles = testDatatype.files || [];
  const jstdTestDatatype = {
    files: [...currentKarmaFiles, jstdAdapter]
  };

  // Return a clone of the TestDatatype instead of modifying it.
  return Object.assign({}, testDatatype, jstdTestDatatype);
};

module.exports.addJSTDFiles = function addJSTDFiles(karmaConfig) {
  karmaConfig.files.unshift(jstdAdapter);
};
