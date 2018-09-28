var mongoose = require("mongoose");

var volunteerSchema = new mongoose.Schema({
  fname:String,
  lname: String,
  address : String,
  phoneNumber : String,
  email:String,
  center1:String,
  center2:String,
  center3:String

});
module.exports = mongoose.model("Volunteer", volunteerSchema);
