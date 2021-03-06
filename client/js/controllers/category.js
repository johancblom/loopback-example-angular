// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('CategoryController', ['$scope', '$state', 'Category', 'Todo', function($scope,
                                                                      $state, Category, Todo) {

    $scope.categories = [];

    var onSuccess = function(results) {
      $scope.categories = results;
    }

    $scope.getCategories = function() {
      //Categories.getCategories().then(onSuccess);
      Category.find({filter: {'include': 'todos'}}).$promise.then(onSuccess);
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
          alert('found an existing todo in that category, you can\'t delete it');
        }, function () {
          Category
            .deleteById(item)
            .$promise
            .then(function () {
              $scope.getCategories();
            });
        });
    };

    $scope.startEdit = function (category) {
      $scope.editedCategory = category;
    };

    $scope.cancelEdit = function () {
      $scope.editedCategory = null;
      $scope.categoryForm.name.$setPristine();
      $scope.getCategories();
    }

    $scope.inputChanged = function() {
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
