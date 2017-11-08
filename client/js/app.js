// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app', [
    'lbServices',
    'ui.router',
    'ngMessages'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
                                                            $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');
    $stateProvider
      .state('todo', {
        url: '/todo',
        templateUrl: 'views/todo.html',
        controller: 'TodoController',
        authenticate: true
      })
      .state('category', {
        url: '/category',
        templateUrl: 'views/category.html',
        controller: 'CategoryController',
        authenticate: true
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'views/forbidden.html',
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'AuthLoginController'
      })
      .state('logout', {
        url: '/logout',
        controller: 'AuthLogoutController'
      })


  }])
  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      // redirect to login page if not logged in
      if (next.authenticate && !$rootScope.currentUser) {
        event.preventDefault(); //prevent current page from loading
        $state.go('forbidden');
      }
    });
  }]);

