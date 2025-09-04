const express = require('express');
const { NotFoundError, ClientError } = require('./handlers/Error');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//middlewares
app.use(helmet());

//using reverse proxy (NGINX)
// app.use(cors({
//    origin: 'http://127.0.0.1:3000',
//    credentials: true,
// }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
//API 
app.use("/api/user",require("./routes/user"));
app.use("/api/files",require("./routes/files"));
app.use("/api/health",(_,res)=>{
   return res.status(200).json({
      message: "Server working well..."
   })
})

//request for serving the favicon
app.get("/favicon.ico",(req,res)=>{
   return res.sendStatus(204);
});

app.all("*",(req,_res,next)=>{
   console.log("path : ",req.originalUrl);
   console.log(new NotFoundError("Sorry,this page does not exists").stack);
   return next(new NotFoundError("Sorry,this page does not exists"));
});

const handleDuplicateError = (err)=>{
   //converted the error into string and retireved the key out of it
   let errStr = JSON.stringify(err.keyPattern);
   return new ClientError(`${errStr.substring(2,errStr.indexOf(':')).replace(/"/g,"")} already exists...`);
}

const handleFileSizeError = (err)=>{
   return new ClientError(`${err.message}.It should be less than 2MB`)
}


//global error middleware
app.use((error,_req,res,_)=>{
   console.log("entered the global error middleware...");
   let err = {...error};
   
   err.statusCode = err.statusCode || 500;
   err.msg = err.statusCode == 500 ? 'Sorry,something went wrong!' : err.msg;
   
   if(err.code === 11000){
      err = handleDuplicateError(err);
   }
   if(err.code === 'LIMIT_FILE_SIZE'){
      err = handleFileSizeError(err);
   }
   
   console.log('Error : ', err);
   //sending the error response
   return res.status(err.statusCode).json({
    status : "Failed",
    error : err.msg,
    name : err.name
   });
});

module.exports = app;