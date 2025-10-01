import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import ProfilePic from "./ProfilePic";
import Button from "./Button";
import { NavLink } from "react-router-dom";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import FileChangeStatusModal from "./FileStatusChangeModal";
import PreviewReviewer from "./PreviewReviewer";
import Loader from "./Loader";
import { ThemeContext } from "../context/ThemeContext";
import FileDeleteModal from "./FileDeleteModal";

const File = ({
  file,
  showPostedBy = true,
  updateCurrentFileStatus = null,
  exposeSensitiveFunctions = false,
}) => {
  const { profile, updateAnalytics } = useContext(UserContext);
  const { Theme, fontStyle } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);
  const [showFileDeleteModal, setShowFileDeleteModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [load, setLoad] = useState(false);

  //function for downloading the file
  const downloadFile = async (file) => {
    try {
      //recieving the file from the server
      setLoad(true);
      let resp = await axios.get(file.cloudfront, {
        responseType: "arraybuffer",
        onDownloadProgress: (progress) => {
          console.log("progress : ", progress.loaded);
        },
      });
      const { data } = resp;
      // //downloading the file and saving it to the device
      const blob = new Blob([data]);
      saveAs(blob, file.filename + "." + file.filetype);
      Swal.fire({
        icon: "success",
        title: "Yayy...",
        text: "File downloaded successfully!",
      });

      //update the metrics
      updateAnalytics("num_download", "downloadIncrement");
      return;
    } catch (err) {
      console.log("err in file : ", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.error,
      });
    } finally {
      setLoad(false);
    }
  };

  const openStatusModal = () => {
    setShowModal(true);
  };

  const closeStatusModal = () => {
    setShowModal(false);
  };

  const openFileDeleteModal = () => {
    setShowFileDeleteModal(true);
  };

  const closeFileDeleteModal = () => {
    setShowFileDeleteModal(false);
  };

  const updateFileStatus = (isDeleteOperation) => {
    updateCurrentFileStatus(file, isDeleteOperation);
    isDeleteOperation ? closeFileDeleteModal() : closeStatusModal();
  };

  const performDeleteAction = () => {
    openFileDeleteModal();
  };

  const performPerviewAction = () => {
    setShowPreview(!showPreview);
  };

  const performStatusAction = () => {
    openStatusModal();
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
        {showFileDeleteModal && (
        <FileDeleteModal
          file={file}
          cancelCallback={closeFileDeleteModal}
          updateCallback={updateFileStatus}
        />
      )}
      <div className="d-flex flex-column my-3">
        {showPostedBy ? (
          <div className="d-flex align-items-center my-1">
            <div className="rounded-circle p-1 mx-1 border">
              <ProfilePic
                image={file.uploadedBy.profile_pic}
                height="12px"
                width="12px"
              />
            </div>
            <div
              className="mx-1 text-gray-200"
              style={{
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
                    textDecoration: "underline",
                  }}
                >
                  {file.uploadedBy.username}
                </NavLink>
              )}
            </div>
          </div>
        ) : null}
        <div className="bg-gradient-to-tr from-deepblack 90% to-deepblack/70 rounded-md">
          <div className="file">
            <div
              className={`${
                file.filetype === "pdf" ? "bg-red-600" : "bg-blue-600"
              }`}
              style={{
                width: "5px",
              }}
            ></div>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col justify-items-center mx-2">
                <div
                  className="filename text-gray-200 text-xs  xs:w-[140px] overflow-auto"
                  style={{
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  {file.filename.length > 17
                    ? file.filename.slice(0, 17) + "..."
                    : file.filename}
                </div>
                <div
                  className="filedate text-gray-200"
                  style={{
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  {file.dateUploded.substring(0, file.dateUploded.indexOf("T"))}
                </div>
                <div
                  className="filedate text-gray-200"
                  style={{
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  {file.filesize / (1024 * 1024) < 1
                    ? "Less than a MB"
                    : `${(file.filesize / (1024 * 1024)).toFixed(2)} MB`}
                </div>
                <div
                  className="filedate text-gray-200 font-semibold"
                  style={{
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  {file.filetype.toUpperCase()}
                </div>
                <div
                  className="filedate text-gray-200"
                  style={{
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  <b>{file.isPrivate ? "Private" : null}</b>
                </div>
              </div>
              <div className="d-flex flex-column align-items-center">
                <div className="d-flex align-items-center">
                  {/* donwloading the file */}
                  {load ? (
                    <div className="mr-2 ">
                      <Loader height="20px" width="20px" />
                    </div>
                  ) : (
                    <Button
                      icon={
                        <FontAwesomeIcon icon={faDownload} title="Download" />
                      }
                      callback_func={() => downloadFile(file)}
                      disabled={false}
                      fontStyle={fontStyle}
                      className="border-limegreen text-limegreen hover:bg-limegreen hover:text-black"
                    />
                  )}

                  {/* Rest all of the actions should go here  */}
                  <div className="w-20">
                    <button
                      className={`dropdown-toggle outline-none w-full btn bg-deepblack border-limegreen text-limegreen hover:bg-limegreen hover:text-black text-sm`}
                      id="dropdownMenuLink"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Actions
                    </button>
                    <ul
                      className="dropdown-menu bg-deepblack border-gray-400 text-gray-200"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li
                        className={`mx-1 p-1 hover:cursor-pointer hover:bg-darkaccent`}
                        onClick={performPerviewAction}
                      >
                        {showPreview ? "Close Preview" : "Preview"}
                      </li>
                      {
                  exposeSensitiveFunctions ? 
                  <>
                      <li
                        className={`mx-1 p-1 hover:cursor-pointer hover:bg-darkaccent`}
                        onClick={performStatusAction}
                      >
                        Change Status
                      </li>
                      <li
                        className={`mx-1 p-1 hover:cursor-pointer hover:bg-darkaccent`}
                        onClick={performDeleteAction}
                      >
                        Delete
                      </li>
                      </>
                   :
                 null
                }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showPreview ? (
            <PreviewReviewer
              source={file.cloudfront}
              theme={Theme}
              fileType={file.filetype}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default File;
