const express = require('express');
const router = express.Router();
const upload = require("../utils/Upload");

//uploading the files to gridfs
//allowing only single files to upload
router.post("/",upload.single("file"),(req,res)=>{
  try{
     console.log("id : ",req.file.mimetype);
     return res.status(201).json({
       status : "success",
       msg : "file uploaded successfully.."
     });
  }catch(err){
     console.log("errrrrrrrrrrrrr : ",err);
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

