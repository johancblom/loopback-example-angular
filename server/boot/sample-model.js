var async = require('async');

module.exports = function(app) {
  var users = {};
  app.models.User.create([
    {email: 'foo@bar.com', password: 'foobar'},
    {email: 'bar@foo.com', password: 'barfoo'}
  ], function (err, results) {
    console.log(results);
    users = results;
  });

}

