const express = require('express');
const router = express.Router();
const upload = require("../utils/Upload");
const {Uploader,Fetcher,deleteFileFromS3,updateStatus, downloadFileFromS3} = require("../controllers/Controller");
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
router.post('/download/:fileID', downloadFileFromS3);

//deleting a particular file
router.delete('/delete/:fileID', deleteFileFromS3);

//updating the status of the file
router.patch('/updateStatus/:fileID',async(req,res,next)=>{
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

