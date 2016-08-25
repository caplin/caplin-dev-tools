
module.exports = function configurePackageTestDatatype(testDatatype) {
	const currentKarmaFiles = testDatatype.files || [];
	const jstdAdapterLocation = require.resolve('karma-jstd-adapter', 'jstd-adapter.js');
	const jstdTestDatatype = {
		files: [
			...currentKarmaFiles,
			jstdAdapterLocation
		]
	};

	// Return a clone of the TestDatatype instead of modifying it.
	return Object
		.assign(
			{},
			testDatatype,
			jstdTestDatatype
		);
};
