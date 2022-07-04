//uploading the files to gridfs using multer
const {GridFsStorage} = require('multer-gridfs-storage');
const multer = require('multer');

const storage = new GridFsStorage({
    url : process.env.DATABASE,
    file : (req,u_file)=>{
        return new Promise((resolve,reject)=>{
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