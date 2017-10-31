// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('CategoryController', ['$scope', '$state', 'Category', 'Todo', 'Categories', function($scope,
                                                                      $state, Category, Todo, Categories) {

    $scope.categories = [];

    var onSuccess = function(results) {
      console.log('results' + results);
      $scope.categories = results;
    }

    $scope.getCategories = function() {
      Categories.getCategories().then(onSuccess);
    };

    $scope.getCategories();

    function categoryExists() {
      return function() {
        $scope.categoryForm.name.$setValidity('duplicate', false);
      }
    }

    $scope.categoryExists = categoryExists();

    function createCategory(){
      return function() {
        Category
          .create($scope.editedCategory)
          .$promise
          .then(function (category) {
            $scope.editedCategory = null;
            //$scope.categoryForm.content.$setPristine();
            $('.focus').focus();
            $scope.getCategories();
            $scope.categoryForm.name.$setPristine();
                  });
      }
    }

    $scope.createCategory = createCategory();

      $scope.addCategory = function () {
      Category.findOne(({filter: {'where': {'name': $scope.editedCategory.name}}}),
        categoryExists(),
        createCategory()
      )
    };

    $scope.updateCategory = function (category) {
        Category.upsert(category)
          .$promise
          .then(function (category) {
            console.log('in update');
            $scope.editedCategory = null;
            $('.focus').focus();
            $scope.getCategories();
            $scope.categoryForm.name.$setPristine();

          })
    }

    $scope.removeCategory = function (item) {
      Todo.findOne({filter: {'where': {'categoryId': item.id}}})
        .$promise
        .then(function () {
          console.log('found an existing todo');
          alert('found an existing todo in that category, you can\'t delete it');
        }, function () {
          console.log('did not find an existing todo');
          Category
            .deleteById(item)
            .$promise
            .then(function () {
              $scope.getCategories();
            });
        });
    };

    $scope.startEdit = function (category) {
      console.log("startEdit: category is: " + category.name);
      $scope.editedCategory = category;
    };

    $scope.cancelEdit = function () {
      $scope.editedCategory = null;
      $scope.categoryForm.name.$setPristine();
    }

    $scope.inputChanged = function() {
      console.log('detected input change');
      Category.findOne(({filter: {'where': {'name': $scope.editedCategory.name}}}))
        .$promise
        .then(function() {
            $scope.categoryForm.name.$setValidity('duplicate', false);
          },
          function() {
            $scope.categoryForm.name.$setValidity('duplicate', true);
          });
    }
  }]);
