import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import ProfilePic from "./ProfilePic";
import Button from "./Button";
import { NavLink } from "react-router-dom";
import { faTrashCan, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import FileChangeStatusModal from "./FileStatusChangeModal";
import PreviewReviewer from "./PreviewReviewer";
import Loader from "./Loader";

const File = ({
  file,
  showPostedBy = true,
  updateCurrentFileStatus = null,
  exposeSensitiveFunctions = false,
}) => {
  const { Theme, fontStyle, profile, incrementDownloads } =
    useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [load, setLoad] = useState(false);

  // To delete the file
  const delFile = async (file) => {
    try {
      let resp = await axios.delete(`/files/delete/${file._id}`);
      updateCurrentFileStatus(file, true); //updating the data from the parent component
      return;
    } catch (err) {
      console.log("err : ", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.error,
      });
    }
  };

  //function for downloading the file
  const downloadFile = async (file) => {
    try {
      //recieving the file from the server
      setLoad(true);
      let resp = await axios.get(`/files/download/${file._id}`, {
        responseType: "arraybuffer",
        // onDownloadProgress: (progress) => {
        //   console.log("progress : ", progress.loaded);
        // },
      });
      const { data } = resp;
      // //downloading the file and saving it to the device
      const blob = new Blob([data]);
      saveAs(blob, file.filename + "." + file.filetype);
      // Swal.fire({
      //   icon: "success",
      //   title: "Yayy...",
      //   text: "File downloaded successfully!",
      // });
      //update the metrics
      // incrementDownloads();
      return;
    } catch (err) {
      console.log("err in file : ", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.error,
      });
    }finally{
      setLoad(false);
    }
  };

  const openStatusModal = () => {
    console.log("called");
    setShowModal(true);
  };

  const closeStatusModal = () => {
    setShowModal(false);
  };

  const updateFileStatus = () => {
    updateCurrentFileStatus(file);
    closeStatusModal();
  };

  return (
    <>
      {showModal && (
        <FileChangeStatusModal
          file={file}
          cancelCallback={closeStatusModal}
          updateCallback={updateFileStatus}
        />
      )}
      <div className="d-flex flex-column my-3">
        {showPostedBy ? (
          <div className="d-flex align-items-center my-1">
            <div
              className="mr-1"
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
                fontSize: "12px",
              }}
            >
              By:
            </div>
            <div
              className="rounded-circle p-1 mx-1"
              style={{ border: `1px solid ${Theme.textColor} ` }}
            >
              <ProfilePic
                image={file.uploadedBy.profile_pic}
                height="12px"
                width="12px"
              />
            </div>
            <div
              className="mx-1"
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
                fontSize: "12px",
              }}
            >
              {file.uploadedBy.username === profile.username ? (
                "You"
              ) : (
                <NavLink
                  to={`/profile/${file.uploadedBy.username}`}
                  style={{
                    color: `${Theme.textColor}`,
                    textDecoration: "underline",
                  }}
                >
                  {file.uploadedBy.username}
                </NavLink>
              )}
            </div>
          </div>
        ) : null}
        <div style={{ backgroundColor: `${Theme.surfaceColor}` }}>
          <div className="file">
            <div
              style={{
                width: "1%",
                backgroundColor: `${
                  file.filetype === "pdf" ? "red" : "dodgerBlue"
                }`,
              }}
            ></div>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ width: "99%" }}
            >
              <div className="d-flex flex-column justify-center flex-1 mx-2">
                <div
                  className="filename"
                  style={{
                    color: `${Theme.textColor}`,
                    fontFamily: `${fontStyle}`,
                    width: "100%",
                    overflowX: "scroll",
                  }}
                >
                  {file.filename}
                </div>
                <div
                  className="filedate"
                  style={{
                    color: `${Theme.textColor}`,
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  {file.dateUploded.substring(0, file.dateUploded.indexOf("T"))}
                </div>
                <div
                  className="filedate"
                  style={{
                    color: `${Theme.textColor}`,
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  {file.filesize / 1e6 < 1
                    ? "Less than a MB"
                    : `${(file.filesize / 1e6).toFixed(2)} MB`}
                </div>
                <div
                  className="filedate"
                  style={{
                    color: `${Theme.textColor}`,
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  {file.filetype}
                </div>
                <div
                  className="filedate"
                  style={{
                    color: `${Theme.textColor}`,
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  <b>{file.isPrivate ? "Private" : null}</b>
                </div>
              </div>
              <div className="d-flex flex-column align-items-center">
                <div className="d-flex align-items-center">
                  {/* donwloading the file */}
                  { 
                  
                    load ? <div className="mr-2"><Loader height="20px" width="20px" color={Theme.textColor} /></div>
                    :
                  <Button
                    icon={
                      <FontAwesomeIcon icon={faDownload} title="Download" />
                    }
                    callback_func={() => downloadFile(file)}
                    disabled={false}
                    fontStyle={fontStyle}
                    theme={Theme.theme}
                  />
                  }
                  {exposeSensitiveFunctions ? (
                    <Button
                      icon={
                        <FontAwesomeIcon icon={faTrashCan} title="Delete" />
                      }
                      className="btn-outline-danger"
                      callback_func={() => delFile(file)}
                      disabled={false}
                      fontStyle={fontStyle}
                    />
                  ) : null}
                  {
                    showPreview ? 
                    <Button
                      text="Close"
                      callback_func={() => setShowPreview(!showPreview)}
                      className="btn-outline-danger"
                      disabled={false}
                      fontStyle={fontStyle}
                    />
                    :
                       <Button
                      text="Preview"
                      callback_func={() => setShowPreview(!showPreview)}
                      disabled={file.filetype === "docx"}
                      fontStyle={fontStyle}
                      theme={Theme.theme}
                    />
                    
                  }
                </div>
                {exposeSensitiveFunctions ? (
                  // status of the file
                  <Button
                    text={"Status"}
                    callback_func={openStatusModal}
                    disabled={false}
                    fontStyle={fontStyle}
                    theme={Theme.theme}
                  />
                ) : null}
              </div>
            </div>
          </div>
          {showPreview ? <PreviewReviewer source={file.location} theme={Theme}/> : null}
        </div>
      </div>
    </>
  );
};

export default File;
