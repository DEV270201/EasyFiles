import React, { useContext } from "react";
import "../css/File.css";
import axios from 'axios';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { UserContext } from "../context/UserContext";
import ProfilePic from './ProfilePic';

const File = ({ file }) => {

  const { Theme, profile } = useContext(UserContext);

  const openFile = async () => {
    try {
      //recieving the file from the server
      let resp = await axios.get(`/files/${file.filename}`, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer'
      });
      const { data } = resp;
      //downloading the file and saving it to the device
      const blob = new Blob([data], { type: 'application/pdf' });
      saveAs(blob, file.filename.substring(0, file.filename.indexOf('@')));
      Swal.fire({
        icon: 'success',
        title: 'Yayy...',
        text: 'File downloaded successfully!'
      });
      // console.log("resp : ",resp);
    } catch (err) {
      console.log("err in file : ", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response.data.error
      });
    }
  }


  return (
    <>
      <div className="d-flex flex-column my-3">
        <div className="d-flex align-items-center my-1">
        <div className="mx-2" style={{ color: `${Theme.textColor}` }}>Owner: </div>
          <div className="rounded-circle p-1" style={{border: "1px solid #fff"}} data-toggle="tooltip" data-placement="top" title={file.uploadedBy.username}>
          <ProfilePic image={file.uploadedBy.profile_pic} height="25px" width="25px" />
          </div>
        </div>
        <div className="file" style={{ backgroundColor: `${Theme.surfaceColor}` }}>
          <div className="d-flex flex-column justify-center">
            <div className="filename" style={{ color: `${Theme.textColor}` }}>{file.filename.substring(0, file.filename.indexOf('@'))}</div>
            <div className="filedate" style={{ color: `${Theme.textColor}` }}>{file.dateUploded.substring(0, file.dateUploded.indexOf('T'))}</div>
          </div>
          <button className={`btn mybtn ${Theme.theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'}`} onClick={openFile}>Download</button>
        </div>
      </div>
    </>
  );
}

export default File;