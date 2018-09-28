var mongoose = require("mongoose");

var centerSchema = new mongoose.Schema({
   location: String,
   tenure: String,
   timing: String,
   owner: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },

});

module.exports = mongoose.model("center", centerSchema);
