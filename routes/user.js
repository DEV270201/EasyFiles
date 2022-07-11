const express = require('express');
const router = express.Router();
const {RegisterJoi} = require("../joi/Joi");

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

module.exports = router;