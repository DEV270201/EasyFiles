import { useRef, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import Button from "../components/Button";

const Upload = () => {
  const fref = useRef(null);
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
    let file = fref.current.files[0];
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

  const handleSinglePartUpload = async (fileDetails) => {
    try {
      setLoad(true);
      //get the presigned url for uploading the current file
      let urlData = await axios.post("/api/files/generateSinglePresignedUrl", {
        fileName: fileDetails.s3FileName,
      });

      //upload the file to S3
      let url = urlData.data.data;
      await axios.put(url, fref.current.files[0], {
        headers: {
          "Content-Type": fileDetails.type,
        },
      });

      console.log("heheheh");

      //update the database regarding successful upload
      await axios.post("/api/files/saveFile", {...fileDetails, isPrivate: status.includes("Private")});
      updateAnalytics('num_upload','uploadIncrement'); //incrementing per user upload metric
      Swal.fire({
        icon: "success",
        title: "Yayy...",
        text: "File uploaded successfully!",
      });

      fref.current.value = null;
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

    let { size, type, name } = fref.current.files[0];
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
      <div className="container p-3">
        <div className="outer">
          <h4
            className="text-center font-weight-light mt-1 mb-2"
            style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}
          >
            Upload your file here...
          </h4>
          <div className="inputs">
            <div
              className="label font-weight-bold"
              htmlFor="file"
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
              }}
            >
              File*
            </div>
            <input
              type="file"
              className="form-control myform"
              id="file"
              aria-describedby="emailHelp"
              name="file"
              ref={fref}
              required
            />
            {/* <div className="label font-weight-bold" htmlFor="Filename" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>File Name*</div>
                        <input type="text" className="form-control myform" id="Filename" name="filename" onChange={updateFilename} value={filename} />
                        {
                            filename.length > 15 &&
                            <p style={{ color: `${Theme.danger}`, fontFamily: `${fontStyle}` }}>File name should be less than 15 characters</p>
                        } */}
            <div className="d-flex flex-column align-items-start mt-2">
              <h6
                className="font-weight-bold"
                style={{
                  color: `${Theme.textColor}`,
                  fontFamily: `${fontStyle}`,
                }}
              >
                Status:
              </h6>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="isPrivate"
                  id="ip1"
                  value={"Private"}
                  onChange={changeStatus}
                  checked={status.includes("Private") ? true : false}
                />
                <div
                  style={{
                    color: `${Theme.textColor}`,
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  Private
                </div>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="isPrivate"
                  id="ip2"
                  value={"Public"}
                  onChange={changeStatus}
                  checked={status.includes("Public") ? true : false}
                />
                <div
                  style={{
                    color: `${Theme.textColor}`,
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
                disbaled={true}
                fontStyle={fontStyle}
                theme={Theme.theme}
                className={"mt-3"}
              />
            ) : (
              <Button
                text={"Upload"}
                callback_func={upload}
                disbaled={false}
                fontStyle={fontStyle}
                theme={Theme.theme}
                className={"mt-3"}
              />
            )}
          </div>
          <div className="mt-3">
            <div
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
              }}
            >
              NOTE :{" "}
            </div>
            <div
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
              }}
            >
              1] If you set the status of the file as <b>Private</b> then nobody
              would have access to it.
            </div>
            <div
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
              }}
            >
              2] If you set the status of the file as <b>Public</b> then
              everyone can have access to it.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Upload;
