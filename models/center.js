var mongoose = require("mongoose");

var centerSchema = new mongoose.Schema({
   location: String,
   personIncharge: String,
   centerName: String,
   

});

module.exports = mongoose.model("center", centerSchema);
