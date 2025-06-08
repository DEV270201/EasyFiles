const express = require('express');
const router = express.Router();
const upload = require("../utils/Upload");
const mongoose = require('mongoose');
const {Uploader,Fetcher,DeleteFile,updateStatus, downloadFileFromS3} = require("../controllers/Controller");
const Auth = require('../Middleware/Auth');

//allowing only single files to upload

//getting all the public files uploaded by the users
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

//uploading file to the server
router.post("/upload",[Auth,upload.single('file')],async (req,res,next)=>{
  try{
    console.log("file : ",req.file);
    await Uploader(req);
     return res.status(201).json({
       status : "success",
       msg : "file uploaded successfully.."
     });
  }catch(err){
     console.log("errrrrrrrrrrrrr : ",err);
     return next(err);
  }
});

//downloading a particular file from the server
router.post('/:fname', downloadFileFromS3);

//deleting a particular file
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

//updating the status of the file
router.patch('/updateStatus',async(req,res,next)=>{
 try{
  await updateStatus(req);
  res.status(200).json({
   status:"success",
   msg: "File status updated successfully"
  });
 }catch(err){
  console.log("error : ",err);
  return next(err);
 }
});

module.exports = router;

