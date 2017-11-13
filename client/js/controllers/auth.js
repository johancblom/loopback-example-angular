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
          if (!$scope.message)
            $state.go('todo');
        });
    };
  }])
  .controller('AuthLogoutController', ['$scope', 'AuthService', '$state',
    function($scope, AuthService, $state) {
      AuthService.logout()
        .then(function() {
          $state.go('login');
        });
    }])
