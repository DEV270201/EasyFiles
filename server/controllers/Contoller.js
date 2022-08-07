const File = require('../models/File');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ClientError } = require('../handlers/Error');
const { promisify } = require('util');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name : process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const fs = require('fs');

exports.Fetcher = async(req)=>{
  try {
    let files = await File.find({}).populate({path: 'uploadedBy',select : 'profile_pic username -_id'});
    return files;
  }catch(err){
    console.log("Error in fetcher controller: ",err);
    throw err;
  }
}

exports.Uploader = async(req,filename)=>{
    try{
      let file = {
        filename,
        uploadedBy : req.user.id
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
      return await promisify(jwt.sign)({id : user_id}, process.env.JWT_SECRET);
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

exports.GetProfile = async(req)=>{
  try{
    let resp = await User.findById(req.user.id,{password:0});
    return resp;
  }catch(err){
    console.log("in the get profile controller : ",err);
    throw err;
  }
}

const deleteProfileImage = async(id)=>{
  try{
     await cloudinary.uploader.destroy(id);
  }catch(err){
    throw err;
  }
}

exports.UpdateProfile = async(req)=>{
  try{
    //  console.log("u: ",req.body.profilePicUrl);
    //  console.log("d: ",process.env.DEFAULT);
    // if(!(req.body.profilePicUrl === process.env.DEFAULT)){
    //    console.log("aa gaya...");
    //    await deleteProfileImage(req.body.publicId);
    // }

    //uploading the image to cloudinary
    let file_dir = `profile_uploader/${req.fileName}`;
    let {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
      "public_id": file_dir,
    });

    //deleting the file from the local disk
    fs.unlinkSync(req.file.path);

    //uploading the link into the database
    await User.findByIdAndUpdate(req.user.id,{profile_pic: secure_url});
    return {url:secure_url,id:public_id};
  }catch(err){
    console.log("in the update profile controller : ",err);
    throw err;
  }
}

exports.DeleteProfile = async(req)=>{
  try{
    await deleteProfileImage(req.body.publicId);
    let resp = await User.findByIdAndUpdate(req.user.id,{profile_pic: process.env.DEFAULT},{profile_pic:1});
    return resp;
  }catch(err){
    console.log('in the delete profile controller : ',err);
    throw err;
  }
}


