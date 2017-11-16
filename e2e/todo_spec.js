getRandomNum = function(min, max){
  return parseInt(Math.random() * (max - min) + min);
};

beforeAll(function(done) {
  // var app = require('../server/server');
  // app.dataSources.db.automigrate();

  // browser.get('http://localhost:4000');
  // // browser.sleep(10000);
  // element(by.model('user.email')).clear();
  // element(by.model('user.password')).clear();
  // element(by.model('user.email')).sendKeys('foo@bar.com');
  // element(by.model('user.password')).sendKeys('foobar');
  // var loginBtn = element(by.css('.login-button'));
  // loginBtn.click();
  // element(by.css('[ui-sref="todo"]')).click();
  //
  // var randomNumber = getRandomNum(0,1000);
  // element(by.model('editedTodo.name')).sendKeys('todo ' + randomNumber);
  //
  // var createBtn = element(by.buttonText('Create'));
  // createBtn.click();
  done();
});
describe('Todo test', function() {
  beforeEach(function() {
    element(by.css('[ui-sref="todo"]')).click();
  });


  describe('todo page', function() {
    it('should allow you to login first', function() {
      browser.get('http://localhost:4000');
      // browser.sleep(10000);
      element(by.model('user.email')).clear();
      element(by.model('user.password')).clear();
      element(by.model('user.email')).sendKeys('foo@bar.com');
      element(by.model('user.password')).sendKeys('foobar');
      var loginBtn = element(by.css('.login-button'));
      browser.sleep(500);
      loginBtn.click();
      element(by.css('[ui-sref="todo"]')).click();
      browser.sleep(500);
      var createBtn = element(by.buttonText('Create'));
      expect(createBtn.getText()).toContain('Create');
    });

    it('should allow you to add a todo', function() {

      element(by.css('[ui-sref="category"]')).click();

      var randomNumber = getRandomNum(0,1000);
      element(by.model('editedCategory.name')).sendKeys('category ' + randomNumber);

      var createBtn = element(by.buttonText('Create'));
      createBtn.click();

      element(by.css('[ui-sref="todo"]')).click();

      var randomNumber = getRandomNum(0,1000);
      element(by.model('editedTodo.content')).sendKeys('todo ' + randomNumber);

      element(by.cssContainingText('option', 'category ')).click();

      var createBtn = element(by.buttonText('Create'));
      createBtn.click();


      var todo = element.all(by.repeater('item in todos')).last();

      expect(todo.getText()).toContain('todo '+randomNumber);
    });


    it('should allow you to update a todo', function() {
      var btnElement, txtElement, txtElementText, xclElement;
      element.all(by.repeater('item in todos')).then(function (items) {
        btnElement = items[0].element(by.buttonText('Edit'));
        txtElement = items[0].element(by.className('content'));
        txtElement.getText().then(function (text) {
          txtElementText = text;
        }).then(function () {
          btnElement.click();
          var input = element(by.model('editedTodo.content'));
          expect(input.getAttribute('value')).toBe(txtElementText);
          input.sendKeys(' changed');
          xclElement = element(by.buttonText('Save'));
          xclElement.click();
        });
      });
    });

    it('should not allow you to add a todo twice', function() {
      var txtElement, txtElementText;
      element.all(by.repeater('item in todos')).then(function (items) {
        txtElement = items[0].element(by.className('content'));
        txtElement.getText().then(function (text) {
          txtElementText = text;
        }).then(function () {
          element(by.model('editedTodo.content')).clear().then(function() {
          element(by.model('editedTodo.content')).sendKeys(txtElementText);
          })
        }).then(function() {
          var createBtn = element(by.buttonText('Create'));
          expect(createBtn.isEnabled()).toBe(false);
        });
      })
    });


    it('should allow you to remove a todo', function() {
      var btnElement, txtElement, txtElementText;
      element.all(by.repeater('item in todos')).then(function(items) {
        btnElement = items[0].element(by.buttonText('Delete'));
        txtElement = items[0].element(by.className('content ng-binding'));
        txtElement.getText().then(function (text) {
          txtElementText = text;
        });
        btnElement.click();
      });

      todo = element.all(by.repeater('item in todos')).then(function(items) {
        items.map(function(item) {
          item.getText().then(function(text) {
            expect (text).not.toContain(txtElementText);
          });
        })
      });
    });
  });
})

