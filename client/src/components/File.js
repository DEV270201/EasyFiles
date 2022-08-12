import React, { useContext,useEffect } from "react";
import { UserContext } from "../context/UserContext";
import ProfilePic from './ProfilePic';
import Button from "./Button";
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
          <div className="rounded-circle p-1" style={{border: `1px solid ${Theme.textColor} `}} data-toggle="tooltip" data-placement="top" title={file.uploadedBy.username}>
          <ProfilePic image={file.uploadedBy.profile_pic} height="25px" width="25px" />
          </div>
        </div>
        <div className="file" style={{ backgroundColor: `${Theme.surfaceColor}` }}>
          <div style={{width:'1%',backgroundColor:`${file.filetype === 'pdf' ? 'red' : 'dodgerBlue'}`}}></div>
          <div className="d-flex justify-content-between align-items-center" style={{width:'99%'}} >
          <div className="d-flex flex-column justify-center mx-2">
            <div className="filename" style={{ color: `${Theme.textColor}`,fontFamily:`${fontStyle}`  }}>{file.filename.substring(0, file.filename.indexOf('@'))}</div>
            <div className="filedate" style={{ color: `${Theme.textColor}`,fontFamily:`${fontStyle}`  }}>{file.dateUploded.substring(0, file.dateUploded.indexOf('T'))}</div>
            <div className="filedate" style={{ color: `${Theme.textColor}`,fontFamily:`${fontStyle}`  }}>
              {
                (file.filesize/1000000) < 1 ?
                "Less than a MB"
                :
                `${(file.filesize/1000000).toFixed(2)} MB`
              }
            </div>
          </div>
          <Button text={"Download"} callback_func={fileAction} disbaled={false} fontStyle={fontStyle} theme={Theme.theme} />
              </div>
        </div>
      </div>
    </>
  );
}

export default File;