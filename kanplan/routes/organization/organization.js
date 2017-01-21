var organization = require('./organization.schema.js');

var role = require('../role/role.schema.js');
var validRoles = require('../role/validRoles.js');

var user = require('../user/user.schema.js');

var shortid = require('shortid');

module.exports = function(app) {
  app.get('/organization/:orgid', function(req, res){
    organization.findOne({_id : req.params.orgId}).then(function(organization, err){
      if (err) {
        res.status(500).send(err);
      }
      res.json(organization);
    });
  });

  app.post('/organization/create', function(req, res){
    var orgId = shortid.generate();
    organization.create({
      name : req.body.name,
      description : req.body.description,
      _id : orgId
    }).then(function(organization, err) {
      if(err) {
        res.status(500).send(err);
      }
      role.create({
        orgId : orgId,
        userId : req.body.userId,
        role : "admin"
      }).then(function (role, err) {
        if (err) {
          res.status(500).send(err)
        }
        res.send(organization);
      });
    });
  });

  app.post('/organization/join', function (req, res) {
    if (validRoles.includes(req.body.role)) {
      role.create({
        orgId : req.body.orgId,
        userId : req.body.userId,
        role : req.body.role
      }).then(function (role, err) {
        if (err) {
          res.status(500).send(err);
        }
        user.findById(req.body.userId).then(function (user, err) {
          if (err) {
            res.status(500).send(err);
          }
          
          user.orgs.push(req.body.orgId);
          user.save().then(function(){
              res.json(user);

          }, function(err){

            if(err){
              console.log(err);
              res.status(500).send(err);
            }
          });
        });
      });
    } else {
      res.status(400).send("Please use valid role, role you sent: " + req.body);
    }
  });
};

