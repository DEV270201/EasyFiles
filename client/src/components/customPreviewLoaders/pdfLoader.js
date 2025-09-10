import { useState, useEffect } from "react";
import axios from "axios";

const checkPreviewResource = async (source) => {
  try {
    let response = await axios.head(source);
    return !!response;
  } catch (err) {
    console.log(`error while processing pdf ${source}: `, err);
    return false;
  }
};

const PdfLoader = ({ mainState: { currentDocument } }) => {
  const [status, setStatus] = useState({
    error: false,
  });
  const [canPreview, setPreview] = useState(false);

  useEffect(() => {
    if (!currentDocument) return;
    const source = currentDocument.uri || currentDocument.documentURI;
    setStatus({ error: false });
    checkPreviewResource(source).then((exists) => {
      if (exists) {
        setPreview(true);
        setStatus({ error: false });
      } else {
        setPreview(false);
        setStatus({ error: true });
      }
    });
  }, []);

  const handleLoad = () => {
    setStatus({
      error: false,
    });
  };

  if (!currentDocument) return null;

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
      {/* {status.loading && <Loader height="60px" width="60px" color={"black"} />} */}
      {status.error && <h6>Sorry, something went wrong :( !!</h6>}
      {canPreview && (
        <iframe
          src={currentDocument.uri}
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
      )}
      </div>
    </>
  );
};

PdfLoader.fileTypes = ["pdf", "application/pdf"];
PdfLoader.weight = 1;

PdfLoader.fileLoader = async ({ documentURI, signal, fileLoaderComplete }) => {
  await checkPreviewResource(documentURI);
  // signal is abort signal - you can use it to cancel if needed
  if (signal.aborted) return;
  fileLoaderComplete();
};

export default PdfLoader;
