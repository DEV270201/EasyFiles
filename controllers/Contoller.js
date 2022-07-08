const { ClientError } = require('../handlers/Error');
const File = require('../models/File');
const User = require('../models/User');

exports.Uploader = async(req,filename)=>{
    try{
      let file = {
        filename
      }

      //saving the file in the database
      await File.create(file);
      return;

    }catch(err){
        console.log("Error in uploader : ",err);
        throw err;
    }
}
