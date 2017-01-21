var mongoose = require('mongoose');

module.exports = mongoose.model('user',{
  name : String,
  orgs : [String],
  password : String,
  _id : String
});
