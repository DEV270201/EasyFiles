const express = require('express');
const app = express();

console.log("hey");
app.use((req,res,next)=>{
    if(process.env.ENV == 'development'){
        console.log("in the development mode....");
    }
    next();
});
app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.get("/",(req,res)=>{
  return res.status(200).json({
    msg : "successfulllllllllll"
  });
});

//request for serving the favicon
app.get("/favicon.ico",(req,res)=>{
   res.sendStatus(204);
});

app.all("*",(req,res,next)=>{
   return next("not able to find the route");
});

app.use((err,req,res,next)=>{
   console.log(err);
   console.log("error middleware..");
   res.status(400).json({
    error : "page not found"
   })
});

module.exports = app;