const express = require('express');
const router = express.Router();
const upload = require("../utils/Upload");
const {ClientError} = require("../handlers/Error");
const {Uploader,Fetcher} = require("../controllers/Contoller");
const Auth = require('../Middleware/Auth');
const User = require('../models/User');

//uploading the files to gridfs
//allowing only single files to upload

router.get('/',Auth,async (req,res,next)=>{
  try{
    let resp = await Fetcher(req);
    // console.log("res : ",resp);
    res.status(200).json({
      status : "success",
      data : resp
    });

  }catch(err){
    console.log("in the files router : ",err);
    return next(err);
  }
});

router.post("/upload",[Auth,upload.single('file')],async (req,res,next)=>{
  try{
    console.log("helloo : ",req.filename);
    await Uploader(req,req.filename);
     return res.status(201).json({
       status : "success",
       msg : "file uploaded successfully.."
     });
  }catch(err){
     console.log("errrrrrrrrrrrrr : ",err);
     return next(err);
  }
});

router.get('/:fname',Auth,async (req,res,next)=>{
  //requiring the bucket to fetch the files
  const bucket = require("../utils/Bucket");
  try{
     const file = await bucket.find({filename : req.params.fname}).toArray();
     if(!file){
       return next(new ClientError('no such file exists...'));
     }
     //piping the file chunks to the response
     bucket.openDownloadStreamByName(req.params.fname).pipe(res);

     //updating the count
     await User.findByIdAndUpdate(req.user.id,{$inc : {num_download:1}});
  }catch(err){
   console.log("error : ",err);
   return next(err);
  }
});

module.exports = router;

