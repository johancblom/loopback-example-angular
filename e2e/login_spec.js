beforeAll(function(done) {
  // var app = require('../server/server');
  // app.dataSources.db.automigrate();
  done();
});

describe('login page', function() {
  it('should not allow you to add a category', function() {
    browser.get('http://localhost:4000/#!/category');
    expect (element(by.css('h1')).getText()).toContain('403 Forbidden');
  })
});

describe('login page', function() {
  it('should login valid users', function() {
    browser.get('http://localhost:4000');
    // browser.sleep(10000);
    element(by.model('user.email')).clear();
    element(by.model('user.password')).clear();
    element(by.model('user.email')).sendKeys('foo@bar.com');
    element(by.model('user.password')).sendKeys('foobar');
    var loginBtn = element(by.css('.login-button'));
    browser.sleep(500);
    loginBtn.click();
    browser.sleep(500);
    expect(element(by.css('h1')).getText()).toContain('Todo');
  })
});
