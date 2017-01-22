var task = require('./task.schema.js');
var shortid = require('shortid');
var role = require('../role/role.schema.js');

module.exports = function(app) {
  app.get('/tasks/:orgId', function(req, res){
    var query = ((req.query.state)? {'orgId':req.params.orgId, state : req.query.state} : {'orgId':req.params.orgId});
    task.find(query,
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

    role.findOne({'orgId':req.params.orgId, 'userId':req.body.author}, {'role':true}).then(function(role,err) {
      if (err) {
        res.status(500).send(err);
      }

      if(role == null) {
        res.status(404).send("User does not exist");
      }
      if (role.role == 'admin') {
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
        });
      } else {
        res.status(401).send("User does not have proper role");
      }
    });
  });

  app.put('/task/:taskId', function (req, res) {
    task.findOne({_id : req.params.taskId}).then(function (task, err) {
      if (err) {
        res.status(500).send(err);
      }
      if (task == null) {
        res.status(404).send("Task Id does not exist");
      }

      task.assignee = req.body.userId;
      task.state = "Assigned";

      task.save().then(function () {
        res.json(task);
      },
      function () {
        res.send(err);
      });
    });
  });

  app.post('/task/:taskId/start', function (req, res) {
    task.findOne(req.params.taskId).then(function (task, err) {
      if (err) {
        res.status(500).send(err);
      }
      if(task == null) {
        res.status(404).send("Task with that ID was not found");
      }

      task.timeLog.startTime = new Time();
      task.save().then(function () {
        res.json(task);
      }, function () {
        res.status(500).send(err)
      });
    });
  });

  app.post('/task/:taskId/stop', function(req, res) {
    task.findOne({_id : req.params.taskId}).then(function (task, err) {
      if (err) {
        res.status(500).send(err);
      }
      if (task == null) {
        res.status(404).send("Task with that ID was not found");
      }
      if(task.timeLog.startTime == 0) {
        res.status(400).send("Need to start time before you can stop");
      }

      task.timeWorked =+ ((new Date() - task.timeLog.startTime) / 36e5);
      task.timeLog.startTime = 0;

      task.save().then(function () {
        res.json(task);
      }, function () {
        res.status(500).send(err);
      });
    });
  });

};
