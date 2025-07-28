import { useState, useEffect } from "react";
import Loader from "./Loader";
import axios from 'axios';

const PreviewReviewer = ({ source, theme }) => {
  const [status, setStatus] = useState({
    loading: true,
    error: false,
  });
  const [canPreview, setPreview] = useState(false);

  const handleLoad = () => {
    setStatus({
      loading: false,
      error: false,
    });
  };

  const checkPreviewResource = async ()=> {
    try{
      let response = await axios.head(source);
      if(response){
         setPreview(true);
      }
    }catch(err){
      console.log("error : ",err);
      setStatus({
        loading: false,
        error: true
      })
    }
  }

  useEffect(()=>{
    checkPreviewResource();
  },[]);

  return (
    <>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {status.loading && (
          <Loader height="60px" width="60px" color={theme.textColor} />
        )}

        {status.error && (
          <h6>Sorry, something went wrong :( !!</h6>
        )}
        
        {
          canPreview && (
            <iframe
              src={`${source}#toolbar=0`}
              onLoad={handleLoad}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              className="iframe"
              title="Embedded Content"
            />
          )
        }
      </div>
    </>
  );
};

export default PreviewReviewer;
