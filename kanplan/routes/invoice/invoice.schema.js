var mongoose = require('mongoose');

module.exports = mongoose.model('invoice',{
  taskid : String,
  datefinished : Date,
  totalcompensation : Number
});
