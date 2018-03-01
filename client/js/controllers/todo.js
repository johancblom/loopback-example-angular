// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('TodoController', ['$scope', '$state', 'Todo', 'Category', 'PDFService', function($scope,
                                                                      $state, Todo, Category, PDFService) {
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
      Todo.create(
        {content: $scope.editedTodo.content, categoryId: $scope.category.id}
      )
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

    $scope.findAvailableCategories = function() {
      Category.find({filter: {'include': 'todos'}}).$promise.then(function (results) {
        $scope.availableCategories = results.filter(function(item) { return item.todos.length == 0}) ;
      });
    };

    $scope.findAvailableCategories();

    $scope.cancelEdit = function() {
      $scope.editedTodo = null;
      $scope.category = null;
    };

    $scope.canEdit = function(item) {
      if (item.ownerId == $scope.currentUser.id) {
        return true;
      }
      else {
        return false;
      }
    };

    $scope.generatePDF = function(todo) {
      PDFService.generate(todo);
    }
  }]);
