import { useState, useContext, useCallback } from "react";
import File from "../components/File";
import Swal from "sweetalert2";
import Search from "../components/Search";
import { UserContext } from "../context/UserContext";
import Dropdown from "../components/Dropdown";
import "../css/Files.css";
import { useEffect } from "react";

const FileIterator = ({ filesArray, showPostedBy, exposeSensitiveFunctions=false }) => {
  // const [files, setFiles] = useState(structuredClone(filesArray));
  const [searchRes, setSearchRes] = useState(structuredClone(filesArray));
  const { Theme, fontStyle } = useContext(UserContext);
  const [code, setCode] = useState("Oldest");
  // const [isLoad, setLoad] = useState(true);
 
  //function for searching files
  const searchpdf = (val) => {
    console.log(val);
    let results = !val
      ? filesArray
      : filesArray.filter((file) => {
          return file.filename.toLowerCase().includes(val.toLocaleLowerCase());
        });
    setSearchRes(results);
  };

  const changeVal = useCallback((val) => {
    setCode(val);
  }, []);

  useEffect(()=>{
    console.log("file iterator reloaded...");
  })

  //updating the status of the files
  const updateFileStatus = (file, isDeleteOperation=false) => {

    !isDeleteOperation ? (
      setSearchRes((data) => {
        return data.map((file_obj) => {
          if (file._id === file_obj._id) {
            file_obj.isPrivate = !file_obj.isPrivate;
          }
          return file_obj;
        });
      })
    ) : (
        setSearchRes((data) => {
         return data.filter((file_obj) => {
          if (file._id !== file_obj._id) 
            return true;
        });
      })
    );

    Swal.fire({
        icon: "success",
        title: "Yayy...",
        text: isDeleteOperation ? "File deleted successfully! " : "Status updated successfully!",
      });
    
    return;
  }

  return (
    <>
      <div className="container p-3">
        <div>
          {searchRes !== null ? (
            <>
              <div className="mt-2">
                {searchRes.length === 0 ? (
                  <>
                    <h5
                      className="text-center font-weight-light mt-2"
                      style={{
                        color: `${Theme.textColor}`,
                        fontFamily: `${fontStyle}`,
                      }}
                    >
                      No files yet :(
                    </h5>
                  </>
                ) : (
                  <>
                    <div
                      className="xs:text-center md:text-center font-weight-light mt-4 md:mt-0 title_search_file"
                      style={{
                        color: `${Theme.textColor}`,
                        fontFamily: `${fontStyle}`,
                      }}
                    >
                      <div className="title">
                        Explore files! - (
                        {searchRes.length > 9 || searchRes.length == 0
                          ? searchRes.length
                          : "0" + searchRes.length}
                        )
                      </div>

                      <div className="search_box">
                        <Search searchpdf={searchpdf} />
                      </div>
                    </div>
                    {searchRes.length === 0 ? (
                      <>
                        <h4
                          className="text-center font-weight-light my-5"
                          style={{
                            color: `${Theme.textColor}`,
                            fontFamily: `${fontStyle}`,
                          }}
                        >
                          No such file found :(
                        </h4>
                      </>
                    ) : (
                      <>
                        <Dropdown func={changeVal} name={code} />
                        <div className="inner_files mt-3">
                          {[...searchRes]
                            .sort((a, b) => {
                              if (code === "Oldest") {
                                return a.dateUploded > b.dateUploded ? 1 : -1;
                              } else if (code === "Newest") {
                                return a.dateUploded > b.dateUploded ? -1 : 1;
                              } else if (code === "A-Z") {
                                return a.filename > b.filename ? 1 : -1;
                              } else {
                                return a.filename > b.filename ? -1 : 1;
                              }
                            })
                            .map((file, index) => {
                              return (
                                <div key={index}>
                                  <File
                                    file={file}
                                    showPostedBy={showPostedBy}
                                    updateCurrentFileStatus={updateFileStatus}
                                    exposeSensitiveFunctions={exposeSensitiveFunctions}
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-center align-items-center">
                <h5
                  className="text-center font-weight-light"
                  style={{
                    color: `${Theme.textColor}`,
                    fontFamily: `${fontStyle}`,
                  }}
                >
                  Sorry, cannot find files :(
                </h5>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FileIterator;
