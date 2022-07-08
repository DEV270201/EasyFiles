const mongoose = require('mongoose');

//creating a bucket
let bucket;
mongoose.connection.on("connected", () => {
   try {
      let database = mongoose.connections[0].db;
      bucket = new mongoose.mongo.GridFSBucket(database, {
         bucketName: "uploads"
      });
      console.log("bucket created...");
      module.exports = bucket;
   } catch (err) {
      console.log("Error in Bucket.js... : ", err);
   }
});
