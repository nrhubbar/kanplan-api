var mongoose = require('mongoose');

module.exports = mongoose.model('user',{
  orgid : String,
  userid : String,
  roles : [String]
});
