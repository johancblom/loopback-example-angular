// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('TodoController', ['$scope', '$state', 'Todo', 'Category', function($scope,
                                                                      $state, Todo, Category) {
    $scope.todos = [];
    function getTodos() {
      Todo
        .find({filter: {'include': 'category'}})
        .$promise
        .then(function(results) {
          console.log(results);
          $scope.todos = results;
        });
    }
    getTodos();

    $scope.addTodo = function() {
      console.log($scope.newTodo);
      Category.todos
        .create({id: $scope.category.id}, {content: $scope.newTodo.content})
        .$promise
        .then(function(todo) {
          $scope.newTodo = null;
          $scope.category = null;
          $scope.todoForm.content.$setPristine();
          $('.focus').focus();
          getTodos();
        });
    };

    $scope.createTodo = function() {
      Category.todos
        .create({id: $scope.category.id}, {content: $scope.editedTodo.content})
        .$promise
        .then(function(todo) {
          $scope.editedTodo = null;
          $scope.category = null;
          //$scope.todoForm.content.$setPristine();
          $('.focus').focus();
          getTodos();
        });
    }
    $scope.removeTodo = function(item) {
      Todo
        .deleteById(item)
        .$promise
        .then(function() {
          getTodos();
        });
    };

    $scope.updateTodo = function(item) {
      console.log(item);
      Todo
        .upsert({id: $scope.editedTodo.id, categoryId: $scope.category.id, content: item.content})
        .$promise
        .then(function() {
          getTodos();
        });
      $scope.editedTodo = null;
      $scope.category = null;
    }


    $scope.startEdit = function (todo) {
      console.log("startEdit: todo is: " + todo.category.name);
      $scope.editedTodo = todo;
      $scope.category = todo.category;
    }

    $scope.categories = [];
    function getCategories() {
      Category
        .find()
        .$promise
        .then(function(results) {
          console.log(results);
          $scope.categories = results;
        });
    }

    $scope.cancelEdit = function() {
      $scope.editedTodo = {};
      $scope.category = null;
    };

    getCategories();

    $scope.addCategory = function() {
      Category
        .create($scope.newCategory)
        .$promise
        .then(function(category) {
          $scope.newCategory = {};
          //$scope.categoryForm.content.$setPristine();
          $('.focus').focus();
          getCategories();
        });
    };

    $scope.removeCategory = function(item) {
      Category
        .deleteById(item)
        .$promise
        .then(function() {
          getCategories();
        });
    };
  }]);
