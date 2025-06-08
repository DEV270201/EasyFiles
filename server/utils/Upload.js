//uploading the files to gridfs using multer
const multer = require('multer');
const path = require('path');
const { ClientError } = require('../handlers/Error');

// let pattern = /^[a-zA-Z0-9]+[a-zA-Z0-9\s]*$/;


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname,"../uploads/")); //store it in the uploads directory on the server
    },
    filename: function (req, file, cb){
        const uniqueSuffix = Date.now();
        let extension = path.extname(file.originalname);
        req.extension = extension;
        let fileNameLength = file.originalname.length;
        let fileName="";
        if(extension === ".pdf"){
            fileName = file.originalname.slice(0,fileNameLength-4) + "-" + String(uniqueSuffix) + path.extname(file.originalname);
            req.originalname = file.originalname.slice(0,fileNameLength-4);
        }
        else{
            fileName = file.originalname.slice(0,fileNameLength-5) + "-" + String(uniqueSuffix) + path.extname(file.originalname); //docx
            req.originalname = file.originalname.slice(0,fileNameLength-5);
        }
        cb(null, fileName);
    }
});

//filtering file types
const fileFilter = (req, file, cb) => {
    console.log("file details: ",file);
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; 
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new ClientError("Invalid file type!"),false);
    }
}

// const storage = new GridFsStorage({
//     url : process.env.DATABASE,
//     file : (req,u_file)=>{
//         return new Promise((resolve,reject)=>{
//             //rejecting the promise if the user uploads the file other than pdf
//             if(!(path.extname(u_file.originalname) === '.pdf' || path.extname(u_file.originalname) === '.docx')){
//                 console.log("extension : ",path.extname(u_file.originalname));
//                 reject(new ClientError("not a valid type of file.."));
//                 return;
//             }

//             if(!pattern.test(req.body.filename)){
//                 reject(new ClientError("Filename should not contain special characaters."));
//                 return;
//             }

//             const file_name = req.body.filename.trim() + '-' + req.user.username + '@' + Date.now();

//             //attaching the property to the request object
//             req.filename = file_name;
//             req.extension = path.extname(u_file.originalname).slice(1,);
//             console.log("isprivate : ",req.body.isPrivate);
//             req.isPrivate = req.body.isPrivate;
//             console.log("name of the file ha bhai: ",file_name);

//             const fileInfo = {
//                 filename : file_name,
//                 bucketName : "uploads"
//             }
//             //uploading the files to gridfs
//             resolve(fileInfo);
//         });
//     }
// });

const upload = multer({storage,
   limits: { fileSize: 500 * 1024 * 1024 }, //2MB file size limit
   fileFilter
});

module.exports = upload;