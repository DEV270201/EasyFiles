const mongoose = require('mongoose');
const {config} = require('dotenv');

//loading the .env contents in the process.env variable
config({path : "./config.env"});
const app = require("./app");

const connect_database = ()=>{
   try{ 
       mongoose.connect(
           process.env.DATABASE , {
               useNewUrlParser: true,
               useUnifiedTopology: true,
           }
       )
       console.log("Database connected successfully!");
   }catch(err){
       console.log("Cannot connect to the database!");
   }
}

connect_database();

let port = process.env.PORT || 4000;
app.listen(port,()=>{
   console.log(`server is listening on ${port}....`);
});

