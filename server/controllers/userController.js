const File = require("../models/File");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ClientError } = require("../handlers/Error");
const { promisify } = require("util");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const userAnalyticsMap = new Map();
let clearTimeoutID;

setTimeout(() => {
  triggerDBFlush();
}, 5000);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

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

//deleting the profile image
const deleteProfileImage = async (id) => {
  try {
    await cloudinary.uploader.destroy(id);
  } catch (err) {
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
      sameSite: "Lax",
      secure: false,
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
      dateJoined: Date.now(),
    });
    return;
  } catch (err) {
    console.log("Error in register controller : ", err);
    throw err;
  }
};

//updating the profile picture
exports.UpdateProfile = async (req) => {
  try {
    //uploading the image to cloudinary
    let file_dir = `profile_uploader/${req.fileName}`;
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: file_dir,
      }
    );

    //deleting the file from the local disk
    fs.unlink(req.file.path, (err) => {
      console.log(
        "Unable to delete profile pic from server disk storage : ",
        req.file.path
      );
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

exports.updateUserStats = (req)=> {
   console.log("req: ", req.body);
   if(req.body.uploadIncrement == 0 && req.body.downloadIncrement == 0)
       return;
   if(userAnalyticsMap.has(req.user.id)){
      let val = userAnalyticsMap.get(req.user.id);
      val.uploadIncrement = val.uploadIncrement + req.body.uploadIncrement;
      val.downloadIncrement = val.downloadIncrement + req.body.downloadIncrement;
      userAnalyticsMap.set(req.user.id, val);
   }else{
      let val = {
         uploadIncrement: req.body.uploadIncrement,
         downloadIncrement: req.body.downloadIncrement
      }
      userAnalyticsMap.set(req.user.id, val);
   }

   if(userAnalyticsMap.size >= 10){
       if(clearTimeoutID){
          clearTimeout(clearTimeoutID);
          clearTimeoutID = null;
       }
       triggerDBFlush();
   }
   return;
}

const getBulkWriteAnalyticsRecords = (userAnalyticsMap) => {
  let bulkWrites = [];
  let count = 0;
  for (const [key, value] of userAnalyticsMap) {
    console.log("key: ",key);
    console.log("value: ",value);
    if (count >= 10) break;

    let bulkWriteObj = {
      updateOne: {
        filter: {
          _id: key,
        },
        update: {
          $inc: {
            num_download: value.downloadIncrement,
            num_upload: value.uploadIncrement,
          },
        },
      },
    };

    bulkWrites.push(bulkWriteObj);
    console.log("obj: ", JSON.stringify(bulkWriteObj));
    userAnalyticsMap.delete(key); //releasing memory
    count++;
  }

  return bulkWrites;
};

const triggerDBFlush = async () => {
  console.log("db flush start before try: ", userAnalyticsMap.size);
  try {

    if(userAnalyticsMap.size != 0){
      //get all the bulk write records
      let bulkWrites = getBulkWriteAnalyticsRecords(userAnalyticsMap);
  
      //perform bulk write operation
      await User.bulkWrite(bulkWrites, {
        ordered: false,
      });
  
      console.log("Bulk Update of user analytics is successful!!!");
    }
  } catch (err) {
    console.log("Error in processing analytics records: ", err);
    //set up a AWS SQS/ RabbitMQ for fallback mechanism
    return;
  } finally {
    console.log("finally");
    clearTimeoutID = setTimeout(() => {
      triggerDBFlush();
    }, 5000);
  }
};
