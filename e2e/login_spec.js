describe('login page', function() {
  it('should not allow you to add a category', function() {
    element(by.css('a[href*="#!/logout"')).click().then(function() {
      element(by.css('#btnPopupOk')).click();
    });
    browser.get('http://localhost:4000/#!/category');
    expect(element(by.css('h1')).getText()).toContain('Not logged in');
  })

  it('should not login invalid users', function() {
    browser.get('http://localhost:4000/#!/login');
    element(by.model('user.email')).clear();
    element(by.model('user.password')).clear();
    element(by.model('user.email')).sendKeys('blah');
    element(by.model('user.password')).sendKeys('blah');
    var loginBtn = element(by.css('.login-button'));
    loginBtn.click();
    expect(element(by.css('.alert')).getText()).toContain('Login failed, please try again');
  })

  it('should login valid users', function() {
    browser.get('http://localhost:4000/#!/login');
    element(by.model('user.email')).clear();
    element(by.model('user.password')).clear();
    element(by.model('user.email')).sendKeys('foo@bar.com');
    element(by.model('user.password')).sendKeys('foobar');
    var loginBtn = element(by.css('.login-button'));
    loginBtn.click();
    expect(element(by.css('h1')).getText()).toContain('Todo');
  })
});
