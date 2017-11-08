var async = require('async');

module.exports = function(app) {
  var users = {}, categories = {};
  app.models.User.create([
    {email: 'foo@bar.com', password: 'foobar'},
    {email: 'bar@foo.com', password: 'barfoo'}
  ], function (err, results) {
    console.log(results);
    users = results;
    app.models.Category.create([
      {name: 'a'},
      {name: 'b'}
    ], function (err, results) {
      console.log(results);
      categories = results;
      console.log('Now creating todos', categories[0]);
      app.models.Todo.create([
        {
          content: 'abc',
          categoryId: categories[0].id,
          userId: users[0].id
        }
      ])
    })
  });

}

