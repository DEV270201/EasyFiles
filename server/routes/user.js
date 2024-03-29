const express = require('express');
const router = express.Router();
const {RegisterJoi} = require("../joi/Joi");
const {RegisterUser,LoginUser,GetProfile,UpdateProfile,DeleteProfile,GetStatsFiles,GetOtherUserProfile} = require("../controllers/Controller");
const ImageUploader = require('../utils/ImageUploader');
const Auth = require('../Middleware/Auth');

router.post("/register",async (req,res,next)=>{
   try{
      let user = await RegisterJoi(req.body);
      await RegisterUser(user);
      res.status(201).json({
         status : "success",
         msg : 'User registered successfully'
      });
   }catch(err){
      console.log("user register : ",err);
      return next(err);
   }
});

router.post('/login',async(req,res,next)=>{
   try{
      await LoginUser(req,res);
      res.status(200).json({
         status : "success",
         msg : "User logged in successfully"
      });
   }catch(err){
      console.log("user login : ",err);
      return next(err);
   }
});

router.get('/profile',Auth,async(req,res,next)=>{
  try{
    let resp = await GetProfile(req);
    res.status(200).json({
      status: "success",
      data: resp
    });

  }catch(err){
    console.log('get profile : ',err);
    return next(err);
  }
});

router.get("/statsfiles",Auth,async(req,res,next)=>{
  try{
    let resp = await GetStatsFiles(req);
    res.status(200).json({
      status: "success",
      data: resp
    });
  }catch(err){
    console.log('get stats : ',err);
    return next(err);
  }
});

router.patch('/updateprofilepic',[Auth,ImageUploader.single('profile_pic')],async(req,res,next)=>{
   try{
      let resp = await UpdateProfile(req);
      res.status(200).json({
        status: "success",
        msg: "profile pic update successfully",
        data: resp
      });
    }catch(err){
      console.log('update profile : ',err);
      return next(err);
    }
});

router.post('/deleteprofilepic',Auth,async(req,res,next)=>{
   try{
      let resp = await DeleteProfile(req);
      res.status(200).json({
        status: "success",
        msg : "profile pic deleted successfully",
        data: resp
      });
    }catch(err){
      console.log('update profile : ',err);
      return next(err);
    }
});

router.get('/logout',Auth,(_req,res)=>{
  console.log("user logging out..");
    res.clearCookie("s_Id");
    res.status(200).json({
      status : 'success',
      msg : "user logged out successfully!"
    })
});

router.get('/profile/:user',Auth,async(req,res,next)=>{
  try{
    let resp = await GetOtherUserProfile(req);
    res.status(200).json({
      status: "success",
      msg : "profile fetched successfully",
      data : resp
    });
  }catch(err){
    console.log('others profile : ',err);
    return next(err);
  }
})

module.exports = router;
