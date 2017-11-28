angular.module('app').factory('messaging', function () {
  var cache = {};

  var subscribe = function (topic, callback) {
    console.log('someone subscribed to topic ', topic);
    if (!cache[topic]) {
      cache[topic] = [];
    }
    cache[topic].push(callback);
    return [topic, callback];
  };

  var publish = function (topic, args) {
    console.log('someone published topic ', topic);
    if (cache[topic]) {
      angular.forEach(cache[topic], function (callback) {
        callback.apply(null, args || []);
      });
    }
  };

  var unsubscribe = function (handle) {
    var t = handle[0];
    if (cache[t]) {
      for(var x = 0; x < cache[t].length; x++)
      {
        if (cache[t][x] === handle[1]) {
          cache[t].splice(x, 1);
        }
      }
    }
  };

  // Define the functions and properties to reveal.
  var service = {
    publish: publish,
    subscribe: subscribe,
    unsubscribe: unsubscribe
  };

  return service;
});
