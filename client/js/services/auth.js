angular
  .module('app')
  .factory('AuthService', ['User', '$q', '$rootScope', 'messaging', 'events', 'dialog', function(User, $q,
                                                                    $rootScope, messaging, events, dialog) {
    var defer = null;

    function login(email, password) {
      $rootScope.message = "";
      messaging.publish(events.message._CLEAR_ERROR_MESSAGES_);
      messaging.publish(events.message._CLEAR_NOTIFICATIONS_);
      return User
        .login({ rememberMe: true}, {email: email, password: password})
        .$promise
        .then(function(response) {
          $rootScope.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            email: email
          };
          messaging.publish(events.message._CLEAR_ERROR_MESSAGES_);
          messaging.publish(events.message._CLEAR_NOTIFICATIONS_);
          return (response);
        }, function(err) {
           $rootScope.currentUser = null;
           messaging.publish(events.message._ADD_ERROR_MESSAGE_, ['Login failed, please try again', 'alert.warning']);
           return $q.reject("login error");

        });
    }

    function logout() {
      defer = $q.defer();
      var message = 'Are you sure you want to logout?';

      messaging.publish(events.message._DISPLAY_DIALOG_, [message, 'popup']);

      messaging.subscribe(events.message._USER_RESPONDED_, function(answer) {
        console.log(answer);
        if (answer == "OK") {
          User.logout().$promise.then(function () {
            defer.resolve();
            $rootScope.currentUser = null;
          })
        }
        else {
          defer.reject();
        }
      });
      return defer.promise;
      // return User
      //   .logout()
      //   .$promise
      //   .then(function() {
      //     $rootScope.currentUser = null;
      //   });
    }

    function register(email, password) {
      messaging.publish(events.message._CLEAR_ERROR_MESSAGES_);
      messaging.publish(events.message._CLEAR_NOTIFICATIONS_);

      return User
        .create({
          email: email,
          password: password
        })
        .$promise
        .then(function() {}, function(err) {
          console.log(err);
          if((err.data.error.message) && (err.data.error.message).includes('Email already exists')) {
            messaging.publish(events.message._ADD_ERROR_MESSAGE_, ['That email address is already in use, please login instead (click Cancel)', 'alert.warning']);

          }
          else {
            $rootScope.message = "Registration failed, possible server issue, please try again";
            messaging.publish(events.message._ADD_ERROR_MESSAGE_, ['Registration failed, possible server issue, please try again', 'alert.warning']);

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

