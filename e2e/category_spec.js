getRandomNum = function(min, max){
  return parseInt(Math.random() * (max - min) + min);
};

beforeAll(function(done) {
  var app = require('../server/server');
  app.dataSources.db.automigrate();
  done();
});

beforeEach(function() {
  browser.get('http://localhost:4000/#!/category');
});

describe('category page', function() {
  it('should allow you to add a category', function() {

    var randomNumber = getRandomNum(0,1000);
    element(by.model('editedCategory.name')).sendKeys('category ' + randomNumber);

    var createBtn = element(by.buttonText('Create'));
    createBtn.click();
    var category = element.all(by.repeater('item in categories')).last();

    expect(category.getText()).toContain('category '+randomNumber);
  });


  it('should allow you to update a category', function() {
    var btnElement, txtElement, txtElementText;
    element.all(by.repeater('item in categories')).then(function (items) {
      btnElement = items[0].element(by.buttonText('Edit'));
      txtElement = items[0].element(by.className('name'));
      txtElement.getText().then(function (text) {
        txtElementText = text;
      }).then(function () {
        btnElement.click();
        var input = element(by.model('editedCategory.name'));
        expect(input.getAttribute('value')).toBe(txtElementText);

      });
    });
  });

  it('should not allow you to add a category twice', function() {
    var txtElement, txtElementText;
    element.all(by.repeater('item in categories')).then(function (items) {
      txtElement = items[0].element(by.className('name'));
      txtElement.getText().then(function (text) {
        txtElementText = text;
      }).then(function () {
        element(by.model('editedCategory.name')).clear().then(function() {
        element(by.model('editedCategory.name')).sendKeys(txtElementText);
        })
      }).then(function() {
        var createBtn = element(by.buttonText('Create'));
        expect(createBtn.isEnabled()).toBe(false);
      });
    })
  });


  it('should allow you to remove a category', function() {
    var btnElement, txtElement, txtElementText;
    element.all(by.repeater('item in categories')).then(function(items) {
      btnElement = items[0].element(by.buttonText('Delete'));
      txtElement = items[0].element(by.className('name ng-binding'));
      txtElement.getText().then(function (text) {
        txtElementText = text;
      });
      btnElement.click();
    });

    category = element.all(by.repeater('item in categories')).then(function(items) {
      items.map(function(item) {
        item.getText().then(function(text) {
          expect (text).not.toContain(txtElementText);
        });
      })
    });
  });
});

