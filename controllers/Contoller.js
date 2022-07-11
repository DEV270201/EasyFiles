const File = require('../models/File');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ClientError } = require('../handlers/Error');
const { promisify } = require('util');

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

exports.LoginUser = async (req,res)=>{
  try{
    const signJWT = async (user_id) => {
      return await promisify(jwt.sign)(user_id, process.env.JWT_SECRET);
    };

    let user_name = String(req.body.username);
    let pass_word = String(req.body.password);

    let user = await User.findOne({username : user_name});

    if(!user){
      throw new ClientError("Invalid credentials!");
    }
    const isPasswordMatch = await bcrypt.compare(
      pass_word,
      user.password
    );
    if (!isPasswordMatch) {
       throw new ClientError("Invalid credentials!");
    }
   
    const token = await signJWT(user.id);

    //it will set the cookie in the browser
    res.cookie('s_Id', token, {
      httpOnly: true,
      expires : new Date(Date.now() + 8 * 3600000),
      samesite : true
    });

    return;

  }catch(err){
    console.log("Error in login controller : ",err);
    throw err;
  }
}