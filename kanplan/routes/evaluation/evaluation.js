var evaluation = require('./evaluation.schema.js');
var task = require('../task/task.schema.js');
var invoice = require('../invoice/invoice.schema.js');

var shortid = require('shortid');

module.exports = function (app) {

    app.post('/evaluation/:taskId', function (req, res) {
        var evaluationId = shortid.generate();
        task.findId(req.params.taskId).then(function (task, err) {
            if (err) {
                res.status(500).send(err);
            }
            if (task == null) {
                res.status(404).send("taskId does not exist");
            }

            task.state = "Pending";
            task.save().then(
                function () {
                    evaluation.create({
                      _id :  evaluationId,
                      notes : req.body.notes,
                      files : req.body.files,
                      taskId : req.params.taskId
                    }).then(function (evaluation, err) {
                        if (err) {
                            res.status(500).send(err);
                        }
                        res.json(evaluation)
                    });
                },
                function () {
                    res.status(500).send(err);
                }
            );
        });
    });

    app.post('/evaluation/accept/:evalId', function (req, res) {
       evaluation.findId(req.params.evalId).then(function (evaluation, err) {
           if (err) {
               res.status(500).send(err);
           }
           if (evaluation == null) {
               res.status(404).send("No evaluaion with that Id")
           }

           task.findId(evaluation.taskId).then(function (task, err) {
               if (err) {
                   res.status(500).send(err);
               }
               if (task == null) {
                   res.status(404).send("taskId does not exist");
               }

               task.state = "Completed";
               task.save().then(function () {
                   invoice.create({
                       taskId : task._id,
                       dateFinished : new Date(),
                       totalCompensation : (task.compensation * task.timeWorked)
                   }).then(function (invoice, err) {
                       if (err) {
                           res.status(500).send(err);
                       }
                       res.json(invoice);
                   });
               },
               function () {
                  res.status(500).send(err);
               });
           });
       });
    });

    app.post('/evaluation/decline/:evalId', function (req, res) {
        evaluation.findId(req.params.evalId).then(function (evaluation, err) {
            if (err) {
                res.status(500).send(err);
            }
            if (evaluation == null) {
                res.status(404).send("Evaluation with that Id did not exist");
            }

            task.findId(evaluation.taskId).then(function (task, err) {
                if (err) {
                    res.status(500).send(err);
                }
                if (task == null) {
                    res.status(404).send("Task with that Id did not exist");
                }

                task.state = "Assigned";
                task.save().then(function () {
                    res.json(task);
                }, function () {
                    res.status(500).send(err);
                });
            });
        });
    });
};