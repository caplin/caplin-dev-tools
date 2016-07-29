
module.exports = function configurePackageTestDatatype(packageTestDatatype) {
	if (!packageTestDatatype.files) {
		packageTestDatatype.files = [];
	}

	packageTestDatatype.files = [
		require.resolve('karma-jstd-adapter', 'jstd-adapter.js')
	];

	return packageTestDatatype;
};
