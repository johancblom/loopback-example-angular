angular
  .module('app')
.controller('AuthLoginController', ['$scope', 'AuthService', '$state',
  function($scope, AuthService, $state) {
    $scope.user = {
      email: 'foo@bar.com',
      password: 'foobar'
    };

    $scope.login = function() {
      AuthService.login($scope.user.email, $scope.user.password)
        .then(function() {
            $state.go('todo');
        }, function(err) {
          console.log('Error: ' + err);
        });
    };
    $scope.register = function() {
      AuthService.register($scope.user.email, $scope.user.password)
        .then(function() {
          $state.go('login');
        }, function(err) {
          console.log('Error: ' + err);
        })
    }

    console.log($state.current);
    if ($state.current.name == 'login') {
      $scope.message = "";
    }
  }])
.controller('AuthLogoutController', ['$scope', 'AuthService', '$state',
  function($scope, AuthService, $state) {
      AuthService.logout()
        .then(function () {
          $state.go('login');
        });
}])
