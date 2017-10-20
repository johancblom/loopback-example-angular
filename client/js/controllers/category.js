// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('CategoryController', ['$scope', '$state', 'Category', function($scope,
                                                                      $state, Category) {
    $scope.categories = [];
    function getCategories() {
      Category
        .find()
        .$promise
        .then(function(results) {
          $scope.categories = results;
        });
    }
    getCategories();

    $scope.addCategory = function() {
      Category
        .create($scope.editedCategory)
        .$promise
        .then(function(category) {
          $scope.editedCategory = null;
          //$scope.categoryForm.content.$setPristine();
          $('.focus').focus();
          getCategories();
        });
    };

    $scope.updateCategory = function(category) {
      Category.upsert(category)
        .$promise
        .then(function(category) {
          $scope.editedCategory = null;
          $('.focus').focus();
          getCategories();
        })

    }

    $scope.removeCategory = function(item) {
      Category
        .deleteById(item)
        .$promise
        .then(function() {
          getCategories();
        });
    };

    $scope.startEdit = function (category) {
      console.log("startEdit: category is: " + category.name);
      $scope.editedCategory = category;
    }

  }]);
