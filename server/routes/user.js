const express = require('express');
const router = express.Router();
const {RegisterJoi} = require("../joi/Joi");
const {RegisterUser,LoginUser,GetProfile,UpdateProfile,DeleteProfile} = require("../controllers/Contoller");
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

router.patch('/updateprofilepic',[Auth,ImageUploader.single('profile_pic')],async(req,res,next)=>{
   try{
      let resp = await UpdateProfile(req);
      res.status(200).json({
        status: "success",
        data: resp
      });
    }catch(err){
      console.log('update profile : ',err);
      return next(err);
    }
});

router.patch('/deleteprofilepic',async(req,res,next)=>{
   try{
      let resp = await DeleteProfile(req);
      res.status(200).json({
        status: "success",
        data: resp
      });
    }catch(err){
      console.log('update profile : ',err);
      return next(err);
    }
});

router.get('/logout',(_req,res)=>{
    res.clearCookie('s_Id');
    res.status(200).json({
      status : 'success',
      msg : "user logged out successfully!"
    })
});

module.exports = router;
