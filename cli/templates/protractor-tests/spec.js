describe('Caplin App', function() {
  it('should load the app with the correct title', function() {
    browser.get('http://localhost:8080');

    expect(browser.getTitle()).toEqual('AppName');
  });
});