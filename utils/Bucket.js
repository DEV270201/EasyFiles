const mongoose = require('mongoose');

//creating a bucket
let bucket;
mongoose.connection.on("connected",()=>{
   let database = mongoose.connections[0].db;
   bucket = new mongoose.mongo.GridFSBucket(database,{
    bucketName : "uploads"
   });
console.log("bucket created...");
// console.log(bucket);
module.exports = bucket;
});
