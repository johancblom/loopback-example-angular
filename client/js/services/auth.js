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
          return (response);
        }, function(err) {
           $rootScope.currentUser = null;
           $rootScope.message = "Login failed, please try again";
           return $q.reject("login error");
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
        .$promise
        .then(function() {}, function(err) {
          console.log(err);
          if((err.data.error.message) && (err.data.error.message).includes('Email already exists')) {
            $rootScope.message = "That email address is already in use, please login instead (click Cancel)";
          }
          else {
            $rootScope.message = "Registration failed, possible server issue, please try again";
          }
          return $q.reject("registration error");
        }
    )
    }

    return {
      login: login,
      logout: logout,
      register: register
    };
  }]);

