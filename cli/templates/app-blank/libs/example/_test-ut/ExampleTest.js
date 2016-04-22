import Example from '../Example';
import chai from 'chai';

const expect = chai.expect;

describe('Testing Example class', () => {
	let exampleClass = null;

	beforeEach(() => {
		exampleClass = new Example();
	});

	afterEach(() => {
		exampleClass = null;
	});

	it('should say hello', () => {
		expect(exampleClass.sayHello()).to.equal('Hello world!');
	})
});
