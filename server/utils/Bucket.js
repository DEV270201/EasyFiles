const mongoose = require('mongoose');
const {GridFSBucket} = require('mongodb');

//creating a bucket
let bucket;
mongoose.connection.on("connected", () => {
   try {
      console.log("connected to the database successfully...");
      let database = mongoose.connections[0].db;
      // bucket = new GridFSBucket(database, {
      //    bucketName: "uploads"
      // });
      // console.log("bucket : ",bucket);
      console.log("bucket created...");
      module.exports = {bucket};
   } catch (err) {
      console.log("Error in Bucket.js... : ", err);
   }
});
