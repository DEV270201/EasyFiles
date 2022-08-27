const express = require('express');
const router = express.Router();
const upload = require("../utils/Upload");
const mongoose = require('mongoose');
const {ClientError} = require("../handlers/Error");
const {Uploader,Fetcher,DeleteFile} = require("../controllers/Controller");
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
  const {bucket} = require("../utils/Bucket");
  try{
     const file = await bucket.find({filename : req.params.fname}).toArray();
     if(!file){
       return next(new ClientError('no such file exists...'));
     }

     //updating the count
     let download_num = await User.findByIdAndUpdate(req.user.id,{$inc : {num_download:1}},{
      fields : {num_download:1},
      new : true
     }
     );

     //appending to the header
     res.append('download',download_num.num_download);

     //piping the file chunks to the response
     bucket.openDownloadStreamByName(req.params.fname).pipe(res);

  }catch(err){
   console.log("error : ",err);
   return next(err);
  }
});

router.delete("/delete/:id",async(req,res,next)=>{
  const id = mongoose.Types.ObjectId(req.params.id);
  const {bucket} = require("../utils/Bucket");
  try{
   await bucket.delete(id);
    await DeleteFile(req);
    return res.status(200).json({
       status : "success",
       msg : "file deleted successfully.."
     });
  }catch(err){
     console.log("errrrrrrrrrrrrr : ",err);
     return next(err);
  }
});

module.exports = router;

