const express = require('express');
const { NotFoundError } = require('./handlers/Error');
const app = express();
const helmet = require('helmet');

//middlewares
app.use(helmet());
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

//global error middleware
app.use((error,_req,res,_)=>{
   console.log("entered the global error middleware...");
   console.log('Error : ', error);
   
   let err = {...error};

   if(err.msg.includes('required pattern') && err.msg.includes('filename')){
      err.msg = 'Filename cannot contain special characters..'
   }
   
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