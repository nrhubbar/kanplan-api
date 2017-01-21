var mongoose = require('mongoose');

module.exports = mongoose.model('organization',{
  name : String,
  description : String,
  _id : String
});
