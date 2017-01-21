var role = require('./role.schema.js');
var validRoles = require('./validRoles.js')

module.exports = function(app) {
  app.get('/role/:orgId/:userId', function(req, res){
    role.findOne({orgId : req.params.orgId, userId : req.params.userId}, {role : true}).then(function(role, err){
      if (err) {
        res.status(500).send(err);
      }
      res.json(role);
    });
  });

  app.get('/role/:orgId', function(req, res){
    role.find({orgId : req.params.orgId}).then(function(role,err){
      if (err) {
        res.status(500).send(err);
      }
      res.json(role);
    });
  });

  app.post('/role/:orgId/userId', function(req, res) {
    if (req.body.role in validRoles) {
      role.create({
        orgId : req.params.orgId,
        userId : req.params.userId,
        role : req.body.role
      }).then(function (role, err) {
        if (err) {
          res.status(500).send(err);
        }
        res.json(role);
      });
    } else {
      res.status(400).send('Invalid Role');
    }
  });

  //update role will be future feature
}
