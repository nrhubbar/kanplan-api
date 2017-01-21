var task = require('./task.schema.js');
var shortid = require('shortid');

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
    }).then(function(task, err) {
      if(err){
        res.send(err);
      }
      res.json(task);
    });
  });

  app.post('/tasks/:orgId', function(req, res) {
    var currentTime = new Date();
    var state = (req.body.assignee == null ? "Open" : "Assigned");
    var taskId = shortid.generate();

    task.create({
      title : req.body.title,
      description : req.body.description,
      compensation : req.body.compensation,
      author : req.body.author,
      orgId : req.params.orgId,
      assignee : req.body.assignee,
      state : state,
      timeWorked : 0,
      creationTime : currentTime,
      timeLog : {
        startTime : null,
        endTime : null
      },
      _id : taskId
    }).then(function(task, err) {
      if (err) {
        res.status(500).send(err);
      }
      res.json(task);

    })
  });
}
