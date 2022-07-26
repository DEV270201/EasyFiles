const express = require('express');
const { NotFoundError, ClientError } = require('./handlers/Error');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//middlewares
app.use(helmet());
app.use(cors({
   origin: ['http://localhost:3000'],
   credentials: true,
}));
app.use(cookieParser());
app.use((_req,_res,next)=>{
    if(process.env.ENV == 'development'){
        console.log("in the development mode....");
    }
    next();
});
app.use(express.json());
app.use(express.urlencoded({extended : false}));
//API 
app.use("/user",require("./routes/user"));
app.use("/files",require("./routes/home"));
//request for serving the favicon
app.get("/favicon.ico",(req,res)=>{
   return res.sendStatus(204);
});

app.all("*",(_req,_res,next)=>{
   console.log(new NotFoundError("Sorry,this page does not exists").stack);
   return next(new NotFoundError("Sorry,this page does not exists"));
});

const handleDuplicateError = (err)=>{
   //converted the error into string and retireved the key out of it
   let errStr = JSON.stringify(err.keyPattern);
   return new ClientError(`${errStr.substring(2,errStr.indexOf(':')).replace(/"/g,"")} already exists...`);
}

const handleFileSizeError = (err)=>{
   return new ClientError(`${err.message}.It should be less than 1MB`)
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
   res.status(err.statusCode).json({
    status : "Failed",
    error : err.msg,
    name : err.name
   });
});

module.exports = app;