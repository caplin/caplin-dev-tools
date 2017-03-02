import {{componentName}} from '../component';
import chai from 'chai';

const expect = chai.expect;

describe('Testing {{componentName}}', () => {
	let testComponent = null;

	beforeEach(() => {
		testComponent = new {{componentName}}();
	});

	afterEach(() => {
		testComponent = null;
	});

	it('should initially have default message', () => {
		expect(testComponent.getMessage()).to.equal('default message');
	});
});