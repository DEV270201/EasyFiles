const {
  S3
} = require("@aws-sdk/client-s3");
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
  region: "us-east-1",
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
        ContentType:
          req.extension.slice(1) === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
      console.log("error in deleting file from the server disk : ", path);
      console.error(err);
    });

    return;
  } catch (err) {
    console.log("Error in uploader controller: ", err);
    throw err;
  }
};

// exports.downloadFileFromS3 = async (req, res, next) => {