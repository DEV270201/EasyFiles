import React from "react";
import "../css/File.css";
import axios from 'axios';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

const File = ({ file }) => {

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
      <div className="file my-3">
        <div className="d-flex flex-column justify-center">
          <div className="filename">{file.filename.substring(0, file.filename.indexOf('@'))}</div>
          <div className="filedate">{file.dateUploded.substring(0, file.dateUploded.indexOf('T'))}</div>
        </div>
        <button className="btn btn-outline-dark mybtn" onClick={openFile}>Download</button>
      </div>
    </>
  );
}

export default File;