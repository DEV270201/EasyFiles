import { useRef, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import Button from "../components/Button";

const Upload = () => {
  const [file, setFile] = useState();
  // const [filename,setFilename] = useState("");
  const [status, setStatus] = useState("Private");
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const { isLoggedIn, updateAnalytics } = useContext(UserContext);
  const { Theme, fontStyle } = useContext(ThemeContext);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/user/login");
    }
  }, [isLoggedIn, history]);

  const changeStatus = (e) => {
    setStatus(e.target.value);
  };

  const getFileName = (fileType, fileName) => {
    let fileNameLength = fileName.length;
    let namePart;
    switch (fileType) {
      case "application/pdf":
        namePart = fileName.slice(0, fileNameLength - 4);
        return {
          s3_file_name: namePart + "-" + String(Date.now()) + ".pdf",
          original_name: namePart,
        };

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        namePart = fileName.slice(0, fileNameLength - 5);
        return {
          s3_file_name: namePart + "-" + String(Date.now()) + ".docx",
          original_name: namePart,
        };
    }
  };

  // 1. upload the file and check its details
  // 2. decide whether to use multipart upload or just a single upload
  // 3. if multipart then make start multipart request
  // 4. for multipart, check if all the parts are getting uploaded properly
  //5. return success message

  const isVerifyFileInfoCorrect = () => {
    if(!file){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "File not selected!",
      });
      return false;
    }

    let { size, type } = file;
    console.log("type: ", type);
    //check the file type
    if (
      type !== "application/pdf" &&
      type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid file type",
      });
      return false;
    }
    //check the file size
    let requiredSize = 2.1 * 1e9;
    if (size >= requiredSize) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "File size should be no more than 2.0 GB!",
      });
      return false;
    }
    return true;
  };

  const handleFileChange = (event) => {
    let file;
    if (event.target.files) {
      file = event.target.files[0];
    }
    setFile(file);
  };

  const getExtension = (fileType) => {
    let obj = {
      "application/pdf" : "pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
    }

    return obj[fileType] ? obj[fileType] : "";
  }

  const handleSinglePartUpload = async (fileDetails) => {
    try {
      setLoad(true);
      //get the presigned url for uploading the current file
      let urlData = await axios.post("/api/files/generateSinglePresignedUrl", {
        fileName: fileDetails.s3FileName,
      });

      //upload the file to S3
      let url = urlData.data.data;
      await axios.put(url, file, {
        headers: {
          "Content-Type": fileDetails.type,
        },
      });

      console.log("heheheh");

      //update the database regarding successful upload
      await axios.post("/api/files/saveFile", {
        ...fileDetails,
        isPrivate: status.includes("Private"),
      });
      updateAnalytics("num_upload", "uploadIncrement"); //incrementing per user upload metric
      Swal.fire({
        icon: "success",
        title: "Yayy...",
        text: "File uploaded successfully!",
      });

      setFile(undefined);
    } catch (err) {
      console.log("Error while uploading the file: ", err);
    } finally {
      setLoad(false);
    }
    return;
  };

  const upload = async () => {
    //function to verify if the file size and file type should be supported by the application
    if (!isVerifyFileInfoCorrect()) {
      return;
    }

    let { size, type, name } = file;
    let sizeForSingleUpload = 25 * 1e6;
    let { s3_file_name, original_name } = getFileName(type, name);
    let fileDetails = {
      size,
      type,
      s3FileName: s3_file_name,
      originalName: original_name,
    };
    //check if you want to use single presigned url or multipart upload signed url
    if (size <= sizeForSingleUpload) {
      handleSinglePartUpload(fileDetails);
    } else {
      // handleMultipartUpload();
    }

    return;
  };

  //     const upload = async () => {
  //     try {
  //         //function to verify if the file size and file type should be supported by the application
  //         if(!isVerifyFileInfoCorrect()){
  //             return;
  //         }
  //         // if(filename.length > 15)
  //         //     return;
  //         console.log("file: ", fref.current.files);
  //         return;
  //         setLoad(true);

  //         let response = await axios.post('/api/files/upload', {
  //             // filename: filename,
  //             isPrivate: status.includes('Private') ? true : false,
  //             file: fref.current.files[0],
  //         }, {
  //             headers: {
  //                 "Content-Type": "multipart/form-data"
  //             }
  //         });
  //         if (response.data.status === 'success') {
  //             updateAnalytics('num_upload','uploadIncrement'); //incrementing per user upload metric
  //             Swal.fire({
  //                 icon: 'success',
  //                 title: 'Yayy...',
  //                 text: response.data.msg
  //             });
  //             fref.current.value = null;
  //             setLoad(false);
  //         }
  //     } catch (err) {
  //         console.log("Upload err : ", err);
  //         setLoad(false);
  //         Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: err.response.data.error
  //         });
  //         //if the auth cookie expire then log the user out
  //         if (err.response.data.error.toLowerCase().includes('please login')) {
  //             window.localStorage.setItem('isLoggedIn', false);
  //             history.push("/user/login");
  //         }
  //         return;
  //     }
  // }

  // const updateFilename = (event) => {
  //     setFilename(event.target.value);
  // }

  return (
    <>
      <div className="w-full bg-deepblack py-6 flex justify-center items-start">
        <div className="bg-darkaccent w-[90%] sm:w-[50%] xl:w-[25%] p-4 flex flex-col rounded my-5">
          <h2
            className="text-center text-gray-200 mt-1 mb-2 text-xl font-bold"
            style={{ fontFamily: `${fontStyle}` }}
          >
            UPLOAD FILE .....
          </h2>

          <label htmlFor="file" className="text-gray-200">
            File <sup className="-ml-1 text-red-500">*</sup>
          </label>
          <div className="relative">
            <input
              type="file"
              className="hidden"
              id="file"
              aria-describedby="Upload file"
              name="file"
              required
              onChange={handleFileChange}
            />
            <label
              htmlFor="file"
              className={`cursor-pointer flex items-center justify-between border border-gray-200 p-2 rounded`}
            >
              <span className={"text-gray-200"}>
                {file ? ( file.name.length > 20 ? file.name.slice(0,20)+'...'+getExtension(file.type) : file.name) : "Choose file..."}
              </span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </label>
          </div>

          <div className="d-flex flex-column align-items-start mt-2">
            <h6
              className="text-gray-200 mb-1"
              style={{
                fontFamily: `${fontStyle}`,
              }}
            >
              Status<sup className="text-red-500">*</sup>
            </h6>
            <div className="form-check">
              <input
                className="form-check-input accent-limegreen hover:cursor-pointer"
                type="radio"
                name="isPrivate"
                id="ip1"
                value={"Private"}
                onChange={changeStatus}
                checked={status.includes("Private") ? true : false}
              />
              <div
                className="text-gray-200"
                style={{
                  fontFamily: `${fontStyle}`,
                }}
              >
                Private
              </div>
            </div>
            <div className="form-check">
              <input
                className="form-check-input accent-limegreen hover:cursor-pointer"
                type="radio"
                name="isPrivate"
                id="ip2"
                value={"Public"}
                onChange={changeStatus}
                checked={status.includes("Public") ? true : false}
              />
              <div
              className="text-gray-200"
                style={{
                  fontFamily: `${fontStyle}`,
                }}
              >
                Public
              </div>
            </div>
          </div>

          {load ? (
            <Button
              text={"Uploading..."}
              disabled={true}
              fontStyle={fontStyle}
              className={
                "mt-3 border-limegreen text-limegreen hover:bg-limegreen hover:text-black"
              }
            />
          ) : (
            <Button
              text={"Upload"}
              callback_func={upload}
              disabled={false}
              fontStyle={fontStyle}
              className={
                "mt-3 border-limegreen text-limegreen hover:bg-limegreen hover:text-black"
              }
            />
          )}

          <div className="mt-3">
            <p className="text-lg font-bold text-gray-200">NOTE: </p>
            <p className="text-sm md:text-lg text-gray-200">1) <span className="font-semibold">PUBLIC</span> files would be accessible to everyone!</p>
            <p className="text-sm md:text-lg text-gray-200">2) <span className="font-semibold">PRIVATE</span> files would be accessible only by you!</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Upload;
