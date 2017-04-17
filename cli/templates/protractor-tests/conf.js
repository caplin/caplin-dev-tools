exports.config = {
  framework: 'jasmine',
  specs: ['spec.js'],
  onPrepare: function() {
    browser.ignoreSynchronization = true; //used to test non angular apps
  }
}