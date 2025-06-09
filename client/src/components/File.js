import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import ProfilePic from './ProfilePic';
import Button from "./Button";
import { NavLink } from "react-router-dom";
import { faTrashCan ,faDownload} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Swal from 'sweetalert2';
import {saveAs} from "file-saver";
import FileChangeStatusModal from "./FileStatusChangeModal";

const File = ({ file, showPostedBy = true, updateCurrentFileStatus = null }) => {

  const { Theme, fontStyle, profile, incrementDownloads } = useContext(UserContext);
  const [showModal,setShowModal] = useState(false);

  // To delete the file
  const delFile = async (file) => {
    try {
      let resp = await axios.delete(`/files/delete/${file.grid_file_id}`);
      Swal.fire({
        icon: "success",
        title: "Yayy...",
        text: resp.data.msg,
      });
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
        let resp = await axios.post(`/files/${file.filename}`, {
          filename: file.filename,
          bucket: file.bucket,
          key: file.key
        },
        {
          responseType: 'arraybuffer',
          onDownloadProgress: (progress)=> {
            console.log("progress : ", progress.loaded);
          }
        }
      );
        console.log("file resp : ",resp);
        const { data } = resp;
        // //downloading the file and saving it to the device
        const blob = new Blob([data]);
        console.log("file : ",file);
        saveAs(blob,file.filename+"."+file.filetype);
        Swal.fire({
          icon: 'success',
          title: 'Yayy...',
          text: 'File downloaded successfully!'
        });
        //update the metrics
        incrementDownloads();
        return resp;
      } catch (err) {
        console.log("err in file : ", err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response.data.error
        });
      }
    }

    const openStatusModal = () => {
      setShowModal(true);
    }

    const closeStatusModal = () => {
      setShowModal(false);
    }

    const updateFileStatus = () => {
        updateCurrentFileStatus(file);
    }

  return (
    <>
      {showModal && <FileChangeStatusModal file={file} cancelCallback={closeStatusModal} updateCallback={updateFileStatus}/> }
      <div className="d-flex flex-column my-3">
        {
          showPostedBy ?
            <div className="d-flex align-items-center my-1">
              <div className="mr-1" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}`, fontSize: '12px' }} >By:</div>
              <div className="rounded-circle p-1 mx-1" style={{ border: `1px solid ${Theme.textColor} ` }}>
                <ProfilePic image={file.uploadedBy.profile_pic} height="12px" width="12px" />
              </div>
              <div className="mx-1" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}`, fontSize: '12px' }} >
                {
                  file.uploadedBy.username === profile.username ? 'You'
                    :
                    <NavLink to={`/profile/${file.uploadedBy.username}`} style={{ color: `${Theme.textColor}`, textDecoration: 'underline' }}>
                      {
                        file.uploadedBy.username
                      }
                    </NavLink>
                }
              </div>
            </div>
            :
            null
        }
        <div className="file" style={{ backgroundColor: `${Theme.surfaceColor}` }}>
          <div style={{ width: '1%', backgroundColor: `${file.filetype === 'pdf' ? 'red' : 'dodgerBlue'}` }}></div>
          <div className="d-flex justify-content-between align-items-center" style={{ width: '99%' }} >
            <div className="d-flex flex-column justify-center mx-2" style={{ width: '30%' }}>
              <div className="filename" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}`, width: '100%', overflowX: 'scroll' }}>{file.filename}</div>
              <div className="filedate" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>{file.dateUploded.substring(0, file.dateUploded.indexOf('T'))}</div>
              <div className="filedate" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>
                {
                  (file.filesize / 1e6) < 1 ?
                    "Less than a MB"
                    :
                    `${(file.filesize / 1e6).toFixed(2)} MB`
                }
              </div>
              <div className="filedate" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>{file.filetype}</div>
              <div className="filedate" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}><b>{file.isPrivate ? 'Private' : null}</b></div>
            </div>
            <div className="d-flex flex-column align-items-center">
              <div className="d-flex">
                {/* donwloading the file */}
                <Button icon={<FontAwesomeIcon icon={faDownload} title="Download" />} callback_func={()=> downloadFile(file)} disabled={false} fontStyle={fontStyle} theme={Theme.theme} />
                {
                  !showPostedBy ?
                  // deleting the file
                    <Button icon={<FontAwesomeIcon icon={faTrashCan} title="Delete" />} className="btn-outline-danger"  callback_func={()=> delFile(file)} disabled={false} fontStyle={fontStyle} />
                    :
                    null
                }
              </div>
              {
                !showPostedBy ?
                // status of the file
                <Button text={"Status"} callback_func={openStatusModal} disabled={false} fontStyle={fontStyle} theme={Theme.theme} />
                  :
                  null
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default File;