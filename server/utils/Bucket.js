const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const {GridFSBucket} = require('mongodb');

//creating a bucket
let bucket,gfs;
mongoose.connection.on("connected", () => {
   try {
      console.log("connected to the database successfully...");
      let database = mongoose.connections[0].db;
      gfs = Grid(database,mongoose.mongo);
      gfs.collection('uploads');
      bucket = new GridFSBucket(database, {
         bucketName: "uploads"
      });
      console.log("bucket : ",bucket);
      console.log("bucket created...");
      module.exports = {bucket,gfs};
   } catch (err) {
      console.log("Error in Bucket.js... : ", err);
   }
});
