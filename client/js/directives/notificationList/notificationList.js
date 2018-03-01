angular.module('app')
  .directive('notificationList', function(messaging, events) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'js/directives/notificationList/notificationList.html',
		link: function(scope) {
      scope.notifications = [];

      var findNotification = function(txt, array) {
        for (var i=0; i< array.length; i++) {
          if (array[i].message == txt) {
            return true;
          }
        }
        return false;
      };

      scope.onErrorMessagesUpdatedHandler = function (errorMessages) {
        var result = null;
        if(!scope.notifications){
          scope.notifications = [];
        }
        if (errorMessages != undefined) {
          result = findNotification(errorMessages.message, scope.notifications);
        }
        if (!result) {
          scope.notifications.push(errorMessages);
        }
        messaging.publish(events.message._CLEAR_ERROR_MESSAGES_);
      };

      scope.errorMessageUpdateHandle = messaging.subscribe(events.message._ERROR_MESSAGES_UPDATED_, scope.onErrorMessagesUpdatedHandler);

      scope.onUserMessagesUpdatedHandler = function (userMessages) {
        if(!scope.notifications){
          scope.notifications = [];
        }
        scope.notifications.push(userMessages);
        messaging.publish(events.message._CLEAR_USER_MESSAGES_);
      };

      scope.userMessagesUpdatedHandle = messaging.subscribe(events.message._USER_MESSAGES_UPDATED_, scope.onUserMessagesUpdatedHandler);

      scope.onClearNotifications = function () {
        scope.notifications = [];
      };

      scope.clearNotificationsHandle = messaging.subscribe(events.message._CLEAR_NOTIFICATIONS_, scope.onClearNotifications);

      scope.$on('$destroy', function() {
        messaging.unsubscribe(scope.errorMessageUpdateHandle);
        messaging.unsubscribe(scope.userMessagesUpdatedHandle);
        messaging.unsubscribe(scope.clearNotificationsHandle);
      });

      scope.acknowledgeAlert = function(index){
        scope.notifications.splice(index, 1);
      };
		}
	};
});
