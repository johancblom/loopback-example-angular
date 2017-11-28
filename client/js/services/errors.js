angular.module('app')
  .factory('errors',function($timeout, messaging, events) {
    var errorMessages = [];

    var addErrorMessageHandler = function(message, type){
      console.log('In errors, addErrorMessageHandler called with message ', message, 'and type ', type);
      if(!errorMessages){
        errorMessages = [];
      }

      errorMessages.push({type: type, message: message});

      $timeout(function () {
        messaging.publish(events.message._ERROR_MESSAGES_UPDATED_, errorMessages);
      }, 0);

    };

    messaging.subscribe(events.message._ADD_ERROR_MESSAGE_, addErrorMessageHandler);

    var clearErrorMessagesHandler = function() {
      errorMessages = [];
    };

    messaging.subscribe(events.message._CLEAR_ERROR_MESSAGES_, clearErrorMessagesHandler);

    var init = function(){
      console.log('initialising errors service');
      errorMessages = [];
    };

    var errors = {
      init: init,
      addErrorMessageHandler: addErrorMessageHandler,
      clearErrorMessagesHandler: clearErrorMessagesHandler
    };

    return errors;
  });
