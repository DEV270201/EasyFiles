import React from "react";
import "../css/File.css";

const File = ({ file }) => {
  return (
    <>
      <div className="file my-3">
        <div className="d-flex flex-column justify-center">
        <div className="filename">{file.filename.substring(0,file.filename.indexOf('@'))}</div>
        <div className="filedate">{file.dateUploded.substring(0,file.dateUploded.indexOf('T'))}</div>
        </div>
        <button className="btn btn-outline-dark mybtn">Open</button>
      </div>
    </>
  );
}

export default File;