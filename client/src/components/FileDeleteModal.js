//this is the modal for changing the file status
import { useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import Button from "./Button";
import Swal from "sweetalert2";
import "../css/PopupModal.css";

const FileDeleteModal = ({ file, updateCallback, cancelCallback }) => {
  const [deleteLoad, setDeleteLoad] = useState(false);
  const { fontStyle } = useContext(ThemeContext);

  // To change the status of the file
  const deleteFile = async () => {
    try {
      setDeleteLoad(true);
      await axios.delete(`/api/files/delete/${file._id}`);
      setDeleteLoad(false);
      updateCallback(true);
    } catch (err) {
      setDeleteLoad(false);
      console.log("Error in deleting file: ", err);
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
        aria-labelledby="fileDeleteModal"
        // aria-hidden=
      >
        <div className="modal-dialog">
          <div className="modal-content bg-deepblack border-gray-400">
            <div className="modal-header">
              <h5 className="modal-title text-gray-200" id="fileDeleteModalTitle">
                Remove File
              </h5>
              <button
                type="button"
                className="close text-gray-200 hover:text-gray-200"
                onClick={cancelCallback}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-gray-200">
              <div className="text-sm" style={{ fontFamily: `${fontStyle}` }}>
                <b>
                  {file &&
                    (file.filename.length > 25
                      ? file.filename.substring(0, 25) + "..."
                      : file.filename)}
                </b>{" "}
                is {" "}
                <b>{file && (file.isPrivate ? "Private" : "Public")}.</b>
              </div>
              <div className="text-sm" style={{ fontFamily: `${fontStyle}` }}>
                {" "}
                Do you want to delete it permanently?{" "}
              </div>
              <hr className="my-1"/>
              <div style={{ fontFamily: `${fontStyle}`, color: "red" }}>
                <b>This action won't be reversed</b>
              </div>
            </div>
            <div className="modal-footer">
              {deleteLoad ? (
                <Button
                  disabled={true}
                  text={"Deleting..."}
                  fontStyle={fontStyle}
                  className={"btn-outline-danger"}
                />
              ) : (
                <Button
                  disabled={false}
                  text={"Confirm Delete"}
                  callback_func={deleteFile}
                  fontStyle={fontStyle}
                  className={"btn-outline-danger"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileDeleteModal;
