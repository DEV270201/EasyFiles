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
        console.log("Error in uploader controller: ",err);
        throw err;
    }
}

exports.RegisterUser = async(user)=>{
  try{
     await User.create({email : user.email,username : user.username,password : user.password});
     return;
  }catch(err){
    console.log("Error in register controller : ",err);
    throw err;
  }
}