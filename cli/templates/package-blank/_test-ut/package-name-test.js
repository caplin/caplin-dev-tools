import {{packageName}} from '../{{packageName}}';

describe('Testing {{packageName}}', () => {
	let packageToTest = null;

	beforeEach(() => {
		packageToTest = new {{packageName}}();
	});

	afterEach(() => {
		packageToTest = null;
	});

  test("it should initially have default message", () => {
    expect(
      packageToTest.getMessage(),
      'default message'
    );
  });
});
