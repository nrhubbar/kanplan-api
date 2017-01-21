var task = require('./task.schema.js');

module.exports = function(app) {
  app.get('/tasks/:orgId', function(req, res){
    task.find({'ordId':req.params.ordId, 'assignee':req.params.assignee},
    {
      author:true,
      title:true,
      description:true,
      state:true,
      compensation:true,
      timelog:true,
      time_worked:true
    }).then(function(err, task) {
      if(err){
        res.send(err);
      }
      res.json(task);
    });
  });
}
