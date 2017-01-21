var organization = require('./organization.schema.js');
var role = require('../role/role.schema.js');
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
};

