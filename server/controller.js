const mongoose = require('mongoose'),
      reqModel = require('../model'),
      taskModel = mongoose.model('task');

exports.postTask = function(req, res){

    console.log(req.body.dateTime);
    return taskModel
            .create(req.body)
            .then((result) => {
                console.log(result);
                res.json(result);
            })
            .catch(err => {
                console.log(err)
                res.json(err);
            });
}

exports.getAllTask = function(req, res){

    return taskModel
            .find({})
            .sort({dateTime: 1})
            .exec()
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                res.json(err);
            });
}

exports.getTaskByDate = function(req, res){

    const currDate = req.query.curr;
    const nextDate = req.query.next;
    console.log(currDate);
    console.log(nextDate);
    return taskModel
            .find({'dateTime': {$gte: currDate, $lt: nextDate}})
            .exec()
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                res.json(err);
            });

}