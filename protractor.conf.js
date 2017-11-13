var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
  dest: 'target/screenshots',
  filename: 'my-report.html'
});

// An example configuration file.
exports.config = {
// The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

// Capabilities to be passed to the webdriver instance.

  baseUrl: 'http://localhost:3000',

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      args: ['--test-type']
    }
  },

// Spec patterns are relative to the current working directly when
// protractor is called.
  specs: ['e2e/*_spec.js'],

// Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  // Setup the report before any tests start
  beforeLaunch: function() {
    return new Promise(function(resolve){
      reporter.beforeLaunch(resolve);
    });
  },

  // Assign the test reporter to each running instance
  onPrepare: function() {
    jasmine.getEnv().addReporter(reporter);
  },

  // Close the report after all tests finish
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }
};
