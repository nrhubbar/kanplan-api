var mongoose = require('mongoose');

module.exports = mongoose.model('user',{
  taskid : String,
  datefinished : Date,
  totalcompensation : Number
});
