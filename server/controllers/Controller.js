const File = require("../models/File");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ClientError } = require("../handlers/Error");
const { promisify } = require("util");
const {
  S3,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//setting up AWS configuration
const s3 = new S3({
  region: process.env.AWS_REGION,
  // logger: console
});

//fetching all the public files
exports.Fetcher = async (req) => {
  try {
    let files = await File.find({ isPrivate: false }).populate({
      path: "uploadedBy",
      select: "profile_pic username _id",
    }).select('-key -bucket');
    return files;
  } catch (err) {
    console.log("Error in fetcher controller: ", err);
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
        ContentType: req.extension.slice(1) === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
      isPrivate: req.body.isPrivate
    };

    await File.create(file);
    //updating the count
    await User.findByIdAndUpdate(req.user.id, { $inc: { num_upload: 1 } });
    //delete the file from the local disk
    fs.unlink(path, (err)=> {
      console.log("error in deleting file from the server disk : ", path);
      console.error(err);
    });

    return;
  } catch (err) {
    console.log("Error in uploader controller: ", err);
    throw err;
  }
};

//registering the user
exports.RegisterUser = async (user) => {
  try {
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await User.create({
      email: user.email,
      username: user.username,
      password: user.password,
    });
    return;
  } catch (err) {
    console.log("Error in register controller : ", err);
    throw err;
  }
};

//logging in the user
exports.LoginUser = async (req, res) => {
  try {
    const signJWT = async (user_id) => {
      return await promisify(jwt.sign)({ id: user_id }, process.env.JWT_SECRET);
    };

    let user_name = String(req.body.username);
    let pass_word = String(req.body.password);

    let user = await User.findOne({
      $or: [
        {
          username: user_name,
        },
        {
          email: user_name,
        },
      ],
    });

    if (!user) {
      throw new ClientError("Invalid credentials!");
    }
    const isPasswordMatch = await bcrypt.compare(pass_word, user.password);
    if (!isPasswordMatch) {
      throw new ClientError("Invalid credentials!");
    }

    const token = await signJWT(user.id);

    //it will set the cookie in the browser
    res.cookie("s_Id", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000),
      samesite: true,
    });

    return;
  } catch (err) {
    console.log("Error in login controller : ", err);
    throw err;
  }
};

//getting the profile of the user
exports.GetProfile = async (req) => {
  try {
    let resp = await User.findById(req.user.id, { password: 0 });
    return resp;
  } catch (err) {
    console.log("in the get profile controller : ", err);
    throw err;
  }
};

//getting the statistics
exports.GetStatsFiles = async (req) => {
  try {
    let { num_upload, num_download } = await User.findById(req.user.id);
    let files = await File.find({ uploadedBy: req.user.id }).populate({
      path: "uploadedBy",
      select: "profile_pic -_id",
    });
    return {
      stats: {
        num_download,
        num_upload,
      },
      files,
    };
  } catch (err) {
    console.log("in the get statsfiles controller : ", err);
    throw err;
  }
};

//deleting the profile image
const deleteProfileImage = async (id) => {
  try {
    await cloudinary.uploader.destroy(id);
  } catch (err) {
    throw err;
  }
};

//updating the profile picture
exports.UpdateProfile = async (req) => {
  try {
    //  console.log("u: ",req.body.profilePicUrl);
    //  console.log("d: ",process.env.DEFAULT);
    // if(!(req.body.profilePicUrl === process.env.DEFAULT)){
    //    console.log("aa gaya...");
    //    await deleteProfileImage(req.body.publicId);
    // }

    //uploading the image to cloudinary
    let file_dir = `profile_uploader/${req.fileName}`;
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: file_dir,
      }
    );

    //deleting the file from the local disk
    fs.unlink(req.file.path, (err)=>{
      console.log("Unable to delete profile pic from server disk storage : ", req.file.path);
      console.error(err);
    });

    //uploading the link into the database
    await User.findByIdAndUpdate(req.user.id, {
      profile_pic: secure_url,
      p_id: public_id,
    });
    return { url: secure_url, id: public_id };
  } catch (err) {
    console.log("in the update profile controller : ", err);
    throw err;
  }
};

exports.DeleteProfile = async (req) => {
  try {
    console.log("prof : ", req.body.publicId);
    await deleteProfileImage(req.body.publicId);
    let resp = await User.findByIdAndUpdate(
      req.user.id,
      { profile_pic: process.env.DEFAULT, p_id: null },
      {
        new: true,
        select: "profile_pic",
      }
    );
    return resp;
  } catch (err) {
    console.log("in the delete profile controller : ", err);
    throw err;
  }
};

//to make the function sleep as we try for exponential backoff
const sleep = (delay) => {
    return new Promise((resolve)=> {
       setTimeout(()=>{
          resolve(delay);
       },delay);
    });
}

//deleting the file
exports.deleteFileFromS3 = async (req, res, next) => {
  try {
    let {fileID} = req.params;
    
    //delete from MongoDB
    let deletedDoc = await File.findByIdAndDelete(fileID);
    console.log("Deleted document : ", deletedDoc);

    //delete the file from s3
    let params = {
      Key: deletedDoc.key,
      Bucket: deletedDoc.bucket,
    };

    res.status(200).json({
      status: "success",
      msg: "file deleted successfully..",
    });

    //delete from AWS S3
    //here we will use exponential backoff for retrying logic

    for(let retry=1; retry<=3; retry++) {
      try{
        await s3.send(new DeleteObjectCommand(params));
        break;
      }catch(err){
        console.log(`Retry ${retry} : Failed to delete S3 file ${deletedDoc.key}`);
        //if all the retries fail, either create a queue for deleting the file or alert
        if(retry == 3){
            console.log("Not being deleted");
            break;
        }
        await sleep(retry * 1000);
      }
    }

    return;

  } catch (err) {
    console.log("in the delete file controller : ", err);
    throw err;
  }
};

//fetching other users profile
exports.GetOtherUserProfile = async (req) => {
  try {
    //getting the data of the required user
    let user = String(req.params.user);
    let metadata = await User.findOne(
      { username: user },
      {
        password: 0,
        email: 0,
      }
    );
    //getting the files of the required user
    let files = await File.find({ uploadedBy: metadata.id, isPrivate: false });
    return {
      userdata: metadata,
      filedata: files,
    };
  } catch (err) {
    console.log("in the others profile controller : ", err);
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
            $not: "$isPrivate"
          }
        }
      }
    ]);
    return;
  } catch (err) {
    console.log("in the update status controller : ", err);
    throw err;
  }
};

exports.downloadFileFromS3 = async (req, res, next) => {
  try {

    //get file metadata from MongoDB before any processing
    let {fileID} = req.params;
    let file = await File.findById(fileID, 'bucket key filename');
    console.log("file : ",file);
    let { key, bucket, filename } = file;

    let params = {
      Bucket: bucket,
      Key: key,
    };

    const command = new GetObjectCommand(params);
    const s3Response = await s3.send(command);
    const s3Stream = s3Response.Body;
    res.setHeader(
      "Content-Type",
      s3Response.ContentType || "application/octet-stream"
    );
    res.setHeader("Transfer-Encoding", "chunked");
    // res.setHeader('Content-Disposition', 'inline');
    // res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
    s3Stream.on("data", (chunk) => {
      console.log("Chunk Stream size : ", chunk.length);
    });

    try {
      for await (const chunk of s3Stream) {
        console.log("CHUNK: ", chunk.length);
        const canContinue = res.write(chunk);
        if (!canContinue) {
          console.log("chunk length sent: ", chunk.length);
          // throw new Error("sorry");
          await new Promise((resolve) => res.once("drain", resolve));
        }
      }
    } catch (err) {
      console.log("Error while on-going streaming : ", err);
      res.destroy();
      return;
    }

    res.end();
    //  //updating the count
    //  let download_num = await User.findByIdAndUpdate(req.user.id,{$inc : {num_download:1}},{
    //   fields : {num_download:1},
    //   new : true
    //  }
    //  );

    //  //appending to the header
    //  res.append('download',download_num.num_download);

    //  //piping the file chunks to the response
    // //  bucket.createReadStream()
    //  bucket.openDownloadStreamByName(req.params.fname).pipe(res);
  } catch (err) {
    console.log("Error while downloading file : ", err);
    return next(err);
  }
};
