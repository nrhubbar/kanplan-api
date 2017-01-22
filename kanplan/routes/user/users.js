var user = require('./user.schema.js');
var shortid = require('shortid');

module.exports = function(app) {
  app.post('/user/signup', function(req, res){
    var userId = shortid.generate();

    user.create({
      name : req.body.name,
      password : req.body.password,
      _id : userId,
      orgs : [],
      email : req.body.email
    }).then(function(user, err) {
      if (err) {
        res.status(500).send(err);
      }
      res.json({
        name : user.name,
        userId : user._id
      });
    });
  });

  app.post('/user/login', function(req, res){
    user.findOne({'email' : req.body.email}).then(function(user, err) {
      if (err) {
        res.status(500).send(err);
      }
      if (user == null) {
        res.status(404).send("email does not exist");
      }
      if (user.password == req.body.password) {
        res.json(user);
      } else {
        res.status(401).send("Incorect password");
      }
    });
  });

  app.get('/user/:userId', function (req, res){
    user.findOne({_id : req.params.userId}).then(function (user, err) {
      if (err) {
        res.status(500).send(err);
      }
      if (user == null) {
        res.status(404).send("email does not exist");
      }
      res.json(user);
    })
  });
};
