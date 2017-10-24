angular.module('app').factory('Categories', ['Category', function(Category) {
  var allCategories = {};
  allCategories.getCategories = function() {
    var result = Category
      .find()
      .$promise;
    return result;
  };
  return allCategories;
  }
]);
