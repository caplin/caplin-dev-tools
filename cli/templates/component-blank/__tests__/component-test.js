import {{componentName}} from '../component';

describe('Testing {{componentName}}', () => {
	let testComponent = null;

	beforeEach(() => {
		testComponent = new {{componentName}}();
	});

	afterEach(() => {
		testComponent = null;
	});

  test("it should initially have default message", () => {
    expect(
      testComponent.getMessage(),
      'default message'
    );
  });
});
