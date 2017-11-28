angular.module('app').factory('dialog',function($timeout, messaging, events) {
  var messageText = '';
  var displayType = 'popup';

  var displayDialogHandler = function(message, type){
    messageText = message;
    displayType = type;

    $timeout(function(){
      switch(displayType){
        case 'popup':
          messaging.publish(events.message._DISPLAY_POPUP_, [messageText]);
          break;
        case 'confirmation':
          messaging.publish(events.message._DISPLAY_CONFIRMATION_, [messageText]);
          break;
        default:
          messaging.publish(events.message._DISPLAY_POPUP_, [messageText]);
          break;
      }
    }, 0);
  };


  var init = function() {
    messageText = '';
    displayType = 'popup';
    messaging.subscribe(events.message._DISPLAY_DIALOG_, displayDialogHandler);

  };

	var dialog = {
    init: init,
    displayDialogHandler: displayDialogHandler
  };

	return dialog;
});
