var mongoose = require("mongoose");


var UdetailsSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    fname: String,
    lname: String,
    email: String,
    address : String,
    profileImage : String,

});
module.exports = mongoose.model("UserDetail", UdetailsSchema);
