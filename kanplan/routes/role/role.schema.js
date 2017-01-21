var mongoose = require('mongoose');

module.exports = mongoose.model('role',{
  orgId : String,
  userId : String,
  role : String
});
