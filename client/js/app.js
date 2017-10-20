// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app', [
    'lbServices',
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
                                                            $urlRouterProvider) {

    $urlRouterProvider.otherwise('/todo');
    $stateProvider
      .state('todo', {
        url: '/todo',
        templateUrl: 'views/todo.html',
        controller: 'TodoController'
      })
      .state('category', {
        url: '/category',
        templateUrl: 'views/category.html',
        controller: 'CategoryController'
    })


  }]);
