var evaluation = require('./evaluation.schema.js');
var task = require('../task/task.schema.js');
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
};