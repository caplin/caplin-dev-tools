'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.configurePackageTestDatatype = configurePackageTestDatatype;
function configurePackageTestDatatype(packageTestDatatype) {
	packageTestDatatype.frameworks = ['jasmine'];

	return packageTestDatatype;
}