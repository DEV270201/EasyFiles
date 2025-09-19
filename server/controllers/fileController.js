const {
  S3, PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand, CompleteMultipartUploadCommand
} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const { Upload } = require("@aws-sdk/lib-storage");
const {
  InvokeCommand,
  LambdaClient,
} = require("@aws-sdk/client-lambda");
const fs = require("fs");
const File = require("../models/File");
const User = require("../models/User");

//setting up AWS configuration
const s3 = new S3({
  region: process.env.AWS_REGION,
  // logger: console
});

// const cloudfront = new CloudFrontClient({});
const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,
});

//to make the function sleep as we try for exponential backoff
const sleep = (delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(delay);
    }, delay);
  });
};

//deleting the file
exports.deleteFileFromS3 = async (req, res, next) => {
  try {
    let { fileID } = req.params;

    //delete from MongoDB
    let deletedDoc = await File.findByIdAndDelete(fileID);

    //delete the file from s3
    let payload = {
      Key: deletedDoc.key,
      Bucket: deletedDoc.bucket,
      DistributionID: process.env.AWS_CF_DISTRIBUTION_ID,
    };

    let params = {
      FunctionName: "easy_files_s3_deletion",
      Payload: JSON.stringify(payload),
      InvocationType: "Event",
    };

    res.status(200).json({
      status: "success",
      msg: "file deleted successfully..",
    });

    //delete from AWS S3 and invalidate cache by using asynchronous lambda function supporting exponential backoff
    for (let retry = 1; retry <= 3; retry++) {
      try {
        const command = new InvokeCommand(params);
        lambdaClient.send(command);
        console.log("Lambda function invoked successfully!");
        break;
      } catch (err) {
          console.log(
              `Retry ${retry} : Failed to invoke lambda function for deleting S3 file and invalidating clloudfront cache!`
        );
        //if all the retries fail, either create a queue for deleting the file or alert
        if (retry == 3) 
          break;
        await sleep(retry * 1000);
      }
    }
    return;
  } catch (err) {
    console.log("in the delete file controller : ", err);
    throw err;
  }
};

//fetching all the public files
exports.Fetcher = async (req) => {
  try {
    let files = await File.find({ isPrivate: false })
      .populate({
        path: "uploadedBy",
        select: "profile_pic username _id",
      })
      .select("-key -bucket");
    return files;
  } catch (err) {
    console.log("Error in fetcher controller: ", err);
    throw err;
  }
};

//function for completing the multipart upload
exports.completeMultipart = async (req) => {
   try{
      let {fileName, uploadId, parts} = req.body;
      const command = new CompleteMultipartUploadCommand({
         Bucket: process.env.AWS_S3_BUCKET_NAME,
         Key: `files/${fileName}`,
         UploadId: uploadId,
         MultipartUpload: {
            Parts: parts.map((part,index)=>({
              ETag: part.eTag,
              PartNumber: index+1
            }))
         }
      });

     const data = await s3.send(command);
     return data;
   }catch(err){
      console.log(`Error while completing the multipart upload ---> ${fileName}: `, err);
      throw err;
   }
}
//function for generating single presigned url for S3 upload
exports.generateSinglePresignedURL = async (req) => {
   try{      
      let fileName = req.body.fileName;
      const putCommand = new PutObjectCommand({
         Bucket: process.env.AWS_S3_BUCKET_NAME,
         Key: `files/${fileName}`,
      });

      const presignedUrl = await getSignedUrl(s3,putCommand,{
        expiresIn: 180
      });

      return presignedUrl;
   }catch(err){
      console.log(`Error occurred while generating single presigned url ${fileName}: `, err);
      throw err;
   }
}


//function for generating single presigned url for S3 upload
exports.generateSinglePresignedURL = async (req) => {
   try{      
      let fileName = req.body.fileName;
      const putCommand = new PutObjectCommand({
         Bucket: process.env.AWS_S3_BUCKET_NAME,
         Key: `files/${fileName}`,
      });

      const presignedUrl = await getSignedUrl(s3,putCommand,{
        expiresIn: 180
      });

      return presignedUrl;
   }catch(err){
      console.log(`Error occurred while generating single presigned url ${fileName}: `, err);
      throw err;
   }
}

//function for initiating multipart request
exports.initiateMultipart = async (req) => {
   try{

    //initiate multipart upload process
    let fileName = req.body.fileName;
    let contentType = req.body.contentType;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `files/${fileName}`,
      ContentType: contentType
    }
    const createCommand = new CreateMultipartUploadCommand(params);
    const {UploadId} = await s3.send(createCommand);
    return UploadId;
   }catch(err){
      console.log(`Error while initiating multipart upload ${fileName}: `, err);
      throw err;
   }
}

//function for generating presigned urls for S3 multipart upload
exports.generatePresignedURLs = async (req) => {
   try{
      let {fileName, uploadId, partsCount} = req.body;
      let totalParts = Array.from({length: partsCount}, (_,index)=> index+1);
      let successUrls = [];
      let failedUrls = [];

      await Promise.all(
        //traverse through all the parts
        totalParts.map(async (partNumber)=>{
             try{
              const command = new UploadPartCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `files/${fileName}`,
                UploadId: uploadId,
                PartNumber: partNumber
              });
              
              //generate presigned urls for each of the part number
              const signedUrl = await getSignedUrl(s3, command, {
                expiresIn: 120 //valid for 2 minutes
              })
              
              //if generated successfully then push it in the success array
              successUrls.push({
                  uploadId,
                  partNumber,
                  fileName,
                  url: signedUrl
              })

             }catch(err){
                //failed then push it in the failed array with sufficient information for retries
                console.log(`Error in generating presigned url for ${fileName} --- ${partNumber}: `,err);
                failedUrls.push({
                  uploadId,
                  partNumber,
                  fileName,
                  retry: true
                })
             }
        })
      );

      return {
         successUrls,
         failedUrls
      }

   }catch(err){
      console.log(`Error occurred while generating multiple presigned urls ${fileName}: `, err);
      throw err;
   }
}

//saving file details into db
exports.saveFileDetails = async (req) => {
   try {
    console.log(req.body);
    let { size, type, s3FileName, originalName, isPrivate } = req.body;
    let key = `files/${s3FileName}`;
    let file = {
      filename: originalName, //file related details
      uploadedBy: req.user.id, //file related details
      filesize: size, // file related details
      filetype: type, //file related details
      bucket: process.env.AWS_S3_BUCKET_NAME, //s3 related details
      key, //s3 related details
      isPrivate: isPrivate,
      cloudfront: process.env.AWS_CLOUDFRONT + "/" + key,
    };

    await File.create(file);
    return;
  } catch (err) {
    console.log("Error while saving file details into database: ", err);
    throw err;
  }
}


//updating the status of the file
exports.updateStatus = async (req) => {
  try {
    await File.findByIdAndUpdate(req.params.fileID, [
      {
        $set: {
          isPrivate: {
            $not: "$isPrivate",
          },
        },
      },
    ]);
    return;
  } catch (err) {
    console.log("in the update status controller : ", err);
    throw err;
  }
};

//uploading new files to the server
exports.Uploader = async (req) => {
  try {
    let { size, filename, path } = req.file;
    let folderName = "files";
    let readStream = fs.createReadStream(path);
    const parallelUploads = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${folderName}/${filename}`,
        Body: readStream,
        ContentType: req.mimetype
      },
      partSize: 1024 * 1024 * 5, //size of each chunk for multipart uploading
      leavePartsOnError: false,
    });

    parallelUploads.on("httpUploadProgress", (progress) => {
      console.log("total : ", progress.total);
      console.log("loaded : ", progress.loaded);
    });

    const result = await parallelUploads.done();
    console.log("result : ", result);

    //saving the uploaded file related details in the database
    let file = {
      filename: req.originalname, //file related details
      uploadedBy: req.user.id, //file related details
      filesize: size, // file related details
      filetype: req.extension.slice(1), //file related details
      bucket: result.Bucket, //s3 related details
      key: result.Key, //s3 related details
      location: result.Location, //s3 related details
      isPrivate: req.body.isPrivate,
      cloudfront: process.env.AWS_CLOUDFRONT + "/" + result.Key,
    };

    console.log("file : ",file);

    await File.create(file);
    //updating the count
    await User.findByIdAndUpdate(req.user.id, { $inc: { num_upload: 1 } });
    //delete the file from the local disk
    fs.unlink(path, (err) => {
      if(err)
         console.log("error in deleting file from the server disk : ", path);
    });

    return;
  } catch (err) {
    console.log("Error in uploader controller: ", err);
    throw err;
  }
};

// exports.downloadFileFromS3 = async (req, res, next) => {