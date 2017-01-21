var mongoose = require('mongoose');

module.exports = mongoose.model('evaluation',{
  _id : String,
  notes : String,
  files : [String],
  taskId : String
});
