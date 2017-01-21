var mongoose = require('mongoose');

module.exports = mongoose.model('role',{
  orgid : String,
  userId : String,
  role : String
});
