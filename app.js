const express = require('express');
const { NotFoundError, ClientError } = require('./handlers/Error');
const app = express();
const upload = require("./utils/Upload");

app.use((_req,_res,next)=>{
    if(process.env.ENV == 'development'){
        console.log("in the development mode....");
    }
    next();
});


app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use("/",require("./routes/home"));

//request for serving the favicon
app.get("/favicon.ico",(req,res)=>{
   return res.sendStatus(204);
});

//uploading the files
//allowing only single files to upload
app.post("/",upload.single("file"),(req,res)=>{
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

app.get('/:fname',async (req,res,next)=>{
  //requiring the bucket to fetch the files
  const bucket = require("./utils/Bucket");
  try{
     const file = await bucket.find({filename : req.params.fname}).toArray();
     console.log("FILE : ",file);
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

app.all("*",(_req,_res,next)=>{
   console.log(new NotFoundError("Sorry,this page does not exists").stack);
   return next(new NotFoundError("Sorry,this page does not exists"));

});

//global error middleware
app.use((error,_req,res,_)=>{
   console.log("entered the global error middleware...");
   let err = {...error};
   console.log('Error : ', err);
   err.statusCode = err.statusCode || 500;
   err.msg = err.statusCode == 500 ? 'Sorry,something went wrong!' : err.msg;

   //sending the error response
   res.status(err.statusCode).json({
    status : "Failed",
    error : err.msg,
    name : err.name
   });

});

module.exports = app;