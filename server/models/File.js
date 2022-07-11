const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    filename : {
        type : String,
        required : true
    },

   uploadedBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
   },

   filetype : {
    type : String,
    required : true,
    default : "pdf"
   },

   dateUploded : {
    type : Date,
    default : Date.now()
   }

});

const File = mongoose.model('File',FileSchema);

module.exports = File;