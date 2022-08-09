import React, { useContext,useEffect } from "react";
import { UserContext } from "../context/UserContext";
import ProfilePic from './ProfilePic';
import "../css/File.css";

const File = ({ file,func }) => {
  
  const { Theme,fontStyle } = useContext(UserContext);

  useEffect(()=>{
    console.log("file :)");
  });


  const fileAction = ()=>{
     func(file);
  }

  return (
    <>
      <div className="d-flex flex-column my-3">
        <div className="d-flex align-items-center my-1">
        <div className="mx-2" style={{ color: `${Theme.textColor}`,fontFamily:`${fontStyle}`  }}>Owner: </div>
          <div className="rounded-circle p-1" style={{border: "1px solid #fff"}} data-toggle="tooltip" data-placement="top" title={file.uploadedBy.username}>
          <ProfilePic image={file.uploadedBy.profile_pic} height="25px" width="25px" />
          </div>
        </div>
        <div className="file" style={{ backgroundColor: `${Theme.surfaceColor}` }}>
          <div className="d-flex flex-column justify-center">
            <div className="filename" style={{ color: `${Theme.textColor}`,fontFamily:`${fontStyle}`  }}>{file.filename.substring(0, file.filename.indexOf('@'))}</div>
            <div className="filedate" style={{ color: `${Theme.textColor}`,fontFamily:`${fontStyle}`  }}>{file.dateUploded.substring(0, file.dateUploded.indexOf('T'))}</div>
          </div>
          <button className={`btn mybtn ${Theme.theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'}`} onClick={fileAction} style={{fontFamily:`${fontStyle}` }} >Download</button>
        </div>
      </div>
    </>
  );
}

export default File;