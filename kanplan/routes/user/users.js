var user = require('./user.schema.js');
var shortid - require('shortid');

module.exports = function(app) {
  app.post('/user/signup', function(req, res){
    var userId = shortid.generate();

    user.create({
      name : req.body.name,
      password : req.body.password,
      _id : userId,
      orgs : []
    }).then(function(err, user) {
      if (err) {
        res.status(400).send(err);
      }
      res.json({
        name : user.name,
        userId : user._id
      });
    });
  });
}
