var organization = require('./organization.schema.js');
var shortid = require('shortid');

module.exports = function(app) {
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
      

    })
  });
}
