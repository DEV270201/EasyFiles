const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },

   username : {
    type : String,
    required : true,
    unique : true
   },

   password : {
    type : String,
    required : true
   },

   profile_pic : {
    type: String,
    default: process.env.DEFAULT
   },

   p_id : {
    type: String,
    default: null
   },

   dateJoined : {
    type : Date,
    default : Date.now()
   }

});

const User = mongoose.model('User',UserSchema);

module.exports = User;