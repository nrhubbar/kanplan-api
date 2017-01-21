var mongoose = require('mongoose');

module.exports = mongoose.model('task',{
  orgId : String,
  author : String,
  assignee : [String],
  title : String,
  description : String,
  state : String,
  compensation : Number,
  creationTime : Date,
  timelog : {
    startTime : Date,
    endTime : Date
  },
  timeWorked: Number,
  _id : String
});
