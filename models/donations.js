var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
  amountList:{
      amount:String,
      date:String,
      paymentId: String
    }

});

module.exports = mongoose.model("Comment", commentSchema);
