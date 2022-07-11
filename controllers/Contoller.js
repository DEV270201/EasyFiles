const { ClientError } = require('../handlers/Error');
const File = require('../models/File');
const User = require('../models/User');
const bcrypt = require('bcrypt');

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
    //hashing the password
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(user.password, salt);
     
     await User.create({email : user.email,username : user.username,password : user.password});
     return;
  }catch(err){
    console.log("Error in register controller : ",err);
    throw err;
  }
}