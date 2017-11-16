// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('TodoController', ['$scope', '$state', 'Todo', 'Category', function($scope,
                                                                      $state, Todo, Category) {
    $scope.todos = [];
    $scope.getTodos = function() {
      Todo
        .find({filter: {'include': 'category'}})
        .$promise
        .then(function(results) {
          $scope.todos = results;
        });
    }
    $scope.getTodos();

    $scope.createTodo = function() {
      Category.todos
        .create({id: $scope.category.id}, {content: $scope.editedTodo.content})
        .$promise
        .then(function(todo) {
          $scope.editedTodo = null;
          $scope.category = null;
          //$scope.todoForm.content.$setPristine();
          $('.focus').focus();
          $scope.getTodos();
        });
    }
    $scope.removeTodo = function(item) {
      Todo
        .deleteById(item)
        .$promise
        .then(function() {
          $scope.getTodos();
        });
    };

    $scope.updateTodo = function(item) {
      console.log(item);
      Todo
        .upsert({id: $scope.editedTodo.id, categoryId: $scope.category.id, content: item.content})
        .$promise
        .then(function() {
          $scope.getTodos();
        }, function() {
          $scope.getTodos();
        });
      $scope.editedTodo = null;
      $scope.category = null;
    };

    $scope.startEdit = function (todo) {
      $scope.editedTodo = todo;
      $scope.category = todo.category;
    };

    Category.find().$promise.then(function (results) {
      $scope.categories = results;
    });

    $scope.cancelEdit = function() {
      $scope.editedTodo = null;
      $scope.category = null;
    };

  }]);
