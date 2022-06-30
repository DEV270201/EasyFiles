const mongoose = require('mongoose');
const {config} = require('dotenv');

//loading the .env contents in the process.env variable
config({path : "./config.env"});
const app = require("./app");


let port = process.env.PORT | 4000;
app.listen(port,()=>{
   console.log(`server is listening on .....${port}`);
});