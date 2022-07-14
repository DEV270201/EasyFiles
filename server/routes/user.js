const express = require('express');
const router = express.Router();
const {RegisterJoi} = require("../joi/Joi");
const {RegisterUser,LoginUser} = require("../controllers/Contoller");

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

router.get('/logout',(req,res)=>{
    res.clearCookie('s_Id');
    res.status(200).json({
      status : 'success',
      msg : "user logged out successfully!"
    })
});

module.exports = router;