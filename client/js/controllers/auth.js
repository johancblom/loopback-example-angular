angular
  .module('app')
.controller('AuthLoginController', ['$scope', 'AuthService', '$state', 'messaging', 'events',
  function($scope, AuthService, $state, messaging, events) {
    $scope.user = {
      email: 'foo@bar.com',
      password: 'foobar'
    };

    $scope.login = function() {
      AuthService.login($scope.user.email, $scope.user.password)
        .then(function() {
            $state.go('todo');
        }, function(err) {
          $scope.message = "login failed, please try again";
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

    if ($state.current.name == 'login' || $state.current.name == 'register') {
      messaging.publish(events.message._CLEAR_NOTIFICATIONS_);

    }
  }])
.controller('AuthLogoutController', ['$scope', 'AuthService', '$state', 'dialog',
  function($scope, AuthService, $state, dialog) {

      AuthService.logout()
        .then(function () {
          console.log('going back to login');
           $state.go('login');
         });
}])
