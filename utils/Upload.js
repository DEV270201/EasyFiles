//uploading the files to gridfs using multer
const {GridFsStorage} = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');
const { ClientError } = require('../handlers/Error');

const storage = new GridFsStorage({
    url : process.env.DATABASE,
    file : (req,u_file)=>{
        return new Promise((resolve,reject)=>{
            //rejecting the promise if the user uploads the file other than pdf
            if(path.extname(u_file.originalname) !== '.pdf'){
                console.log("extension : ",path.extname(u_file.originalname));
                reject(new ClientError("not a valid type of file.."));
            }
            const file_name = u_file.originalname;
            const fileInfo = {
                filename : file_name,
                bucketName : "uploads"
            }
            resolve(fileInfo);
        });
    }
});

const upload = multer({storage});

module.exports = upload;