import {{componentName}} from '../component';
import chai from 'chai';

describe('Testing {{componentName}}', () => {
	let testComponent = null;

	beforeEach(() => {
		testComponent = new {{componentName}}();
	});

	afterEach(() => {
		testComponent = null;
	});

	it('should initially have default message', () => {
		chai.assert.equal(testComponent.getMessage(),'default message');
	});
});