const express = require('express');
const router = express.Router();
const upload = require("../utils/Upload");
const {ClientError} = require("../handlers/Error");
const {uploader} = require("../joi/Joi");
const {Uploader} = require("../controllers/Contoller");

//uploading the files to gridfs
//allowing only single files to upload
router.post("/",[uploader,upload.single('file')],async (req,res,next)=>{
  try{
    console.log("helloo : ",req.body.filename);
    // await Uploader(req,filename);
     return res.status(201).json({
       status : "success",
       msg : "file uploaded successfully.."
     });
  }catch(err){
     console.log("errrrrrrrrrrrrr : ",err);
     return next(err);
  }
});

router.get('/:fname',async (req,res,next)=>{
  //requiring the bucket to fetch the files
  const bucket = require("../utils/Bucket");
  try{
     const file = await bucket.find({filename : req.params.fname}).toArray();
     if(!file){
       return next(new ClientError('no such file exists...'));
     }

     //piping the file chunks to the response
     bucket.openDownloadStreamByName(req.params.fname).pipe(res);
  }catch(err){
   console.log("error : ",err);
   return next(err);
  }
});

module.exports = router;

