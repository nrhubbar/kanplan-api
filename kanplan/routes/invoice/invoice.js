var invoice = require('./invoice.schema.js');

module.exports = function (app) {
  app.get('/invoice/:orgId', function (req, res) {
     invoice.find({orgId : req.params.orgId}).then(function(invoices, err){
        if(err) {
            res.status(500).send(err);
        }
        if (invoices == null) {
            res.status(404).send("No Invoices found with that org Id");
        }

        res.json(invoices);
     });
  });
};