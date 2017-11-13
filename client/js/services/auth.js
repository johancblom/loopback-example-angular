angular
  .module('app')
  .factory('AuthService', ['User', '$q', '$rootScope', function(User, $q,
                                                                    $rootScope) {
    function login(email, password) {
      $rootScope.message = "";
      return User
        .login({ rememberMe: true}, {email: email, password: password})
        .$promise
        .then(function(response) {
          $rootScope.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            email: email
          };
        }, function(err) {
           $rootScope.currentUser = null;
           $rootScope.message = "Login failed, please try again";
        });
    }

    function logout() {
      return User
        .logout()
        .$promise
        .then(function() {
          $rootScope.currentUser = null;
        });
    }

    function register(email, password) {
      return User
        .create({
          email: email,
          password: password
        })
        .$promise;
    }

    return {
      login: login,
      logout: logout,
      register: register
    };
  }]);

