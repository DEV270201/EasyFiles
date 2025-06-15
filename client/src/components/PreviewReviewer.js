import { useState, useEffect } from "react";
import Loader from "./Loader";

const PreviewReviewer = ({ source, theme }) => {
  const [status, setStatus] = useState({
    loading: true,
    error: false,
  });

  const handleLoad = () => {
    setStatus({
      loading: false,
      error: false,
    });
  };

  const handleError = () => {
    setStatus({
      loading: false,
      error: true,
    });
  };

  useEffect(() => {
    function checkErrorOnTimeout() {
      if (status.loading) {
        handleError();
      }
    }

    let cancelID = setTimeout(() => {
      checkErrorOnTimeout();
    }, 10 * 1000);

    return () => {
      if (cancelID) clearTimeout(cancelID);
    };
  }, []);

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

        <iframe
          src={`${source}#toolbar=0`}
          onLoad={handleLoad}
          onError={handleError}
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
      </div>
    </>
  );
};

export default PreviewReviewer;
