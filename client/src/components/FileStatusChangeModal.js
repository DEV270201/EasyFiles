//this is the modal for changing the file status
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Button from "./Button";
import Swal from "sweetalert2";
import "../css/PopupModal.css";

const FileChangeStatusModal = ({ file, updateCallback, cancelCallback }) => {
  const [updateLoad, setUpdateLoad] = useState(false);
  const { fontStyle } = useContext(UserContext);

  // To change the status of the file
  const updateStatus = async () => {
    try {
      setUpdateLoad(true);
      const resp = await axios.patch(`/api/files/updateStatus/${file._id}`);
      console.log("resp : ", resp);
      setUpdateLoad(false);
      updateCallback();
    } catch (err) {
      setUpdateLoad(false);
      console.log("Error in updatestatus : ", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again in sometime!",
      });
      cancelCallback();
      return;
    }
  };

  return (
    <>
      {/* modal container */}
      <div
        className="modalOuter"
        tabIndex="-1"
        aria-labelledby="fileStatusChangeModal"
        // aria-hidden=
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="fileStatusChangeTitle">
                Update Status
              </h5>
              <button
                type="button"
                className="close"
                onClick={cancelCallback}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ fontFamily: `${fontStyle}` }}>
                <b>
                  {file &&
                    (file.filename.length > 25
                      ? file.filename.substring(0, 25) + "..."
                      : file.filename)}
                </b>{" "}
                is currently{" "}
                <b>{file && (file.isPrivate ? "Private" : "Public")}.</b>
              </div>
              <div style={{ fontFamily: `${fontStyle}` }}>
                {" "}
                Do you want to change the status to{" "}
                <b>{file && (file.isPrivate ? "Public" : "Private")}</b> ?
              </div>
              <div className="mt-1" style={{ fontFamily: `${fontStyle}` }}>
                <b>NOTE:</b>
              </div>
              <div style={{ fontFamily: `${fontStyle}`, color: "red" }}>
                <b>Public - accessible to everyone</b>
              </div>
              <div style={{ fontFamily: `${fontStyle}`, color: "red" }}>
                <b>Private - accessible only to you</b>
              </div>
            </div>
            <div className="modal-footer">
              {updateLoad ? (
                <Button
                  disabled={true}
                  text={"Updating"}
                  fontStyle={fontStyle}
                  className={"btn-outline-primary"}
                />
              ) : (
                <Button
                  disabled={false}
                  text={"Update"}
                  callback_func={updateStatus}
                  fontStyle={fontStyle}
                  className={"btn-outline-primary"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileChangeStatusModal;
