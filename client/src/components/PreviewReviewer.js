import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import PdfLoader from "./customPreviewLoaders/pdfLoader";

const PreviewReviewer = ({ source, theme, fileType }) => {
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
        <DocViewer
          documents={[{ uri: source, fileType }]}
          pluginRenderers={
            fileType === "docx" ? DocViewerRenderers : [PdfLoader]
          }
          prefetchMethod="HEAD"
          style={{ height: "100%", width: "100%" }}
          
          />
      </div>
          {/* <div
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
                  // src={`${source}#toolbar=0`}
                  src={`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8/viewer?url=${encodeURIComponent(source)}&embedded=true`}
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
          </div> */}
    </>
  );
};

export default PreviewReviewer;
