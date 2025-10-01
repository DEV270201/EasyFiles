import { useState, useContext, useCallback } from "react";
import File from "../components/File";
import Swal from "sweetalert2";
import Search from "../components/Search";
import Dropdown from "../components/Dropdown";
import { ThemeContext } from "../context/ThemeContext";
import "../css/Files.css";

const FileIterator = ({
  filesArray,
  showPostedBy,
  exposeSensitiveFunctions = false,
}) => {
  const [searchRes, setSearchRes] = useState(structuredClone(filesArray));
  const { Theme, fontStyle } = useContext(ThemeContext);
  const [code, setCode] = useState("Oldest");

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

  //updating the status of the files
  const updateFileStatus = (file, isDeleteOperation = false) => {
    console.log("status called: ", file);
    !isDeleteOperation
      ? setSearchRes((data) => {
          return data.map((file_obj) => {
            if (file._id === file_obj._id) {
              file_obj.isPrivate = !file_obj.isPrivate;
            }
            return file_obj;
          });
        })
      : setSearchRes((data) => {
          return data.filter((file_obj) => {
            if (file._id !== file_obj._id) return true;
          });
        });

    Swal.fire({
      icon: "success",
      title: "Yayy...",
      text: isDeleteOperation
        ? "File deleted successfully! "
        : "Status updated successfully!",
    });

    return;
  };

  return (
    <>
      <div className="container p-3 bg-darkaccent my-3 rounded">
        <div>
          {searchRes !== null ? (
            <>
              <div className="mt-2">
                <Search searchpdf={searchpdf} />
                {searchRes.length === 0 ? (
                  <>
                    <h4
                      className="text-center font-weight-light my-5 text-gray-200"
                      style={{
                        fontFamily: `${fontStyle}`,
                      }}
                    >
                      Ummm, may be it's not what you are looking for :(
                    </h4>
                  </>
                ) : (
                  <>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-200 text-sm md:text-lg font-semibold">TOTAL FILES - {searchRes.length > 10 ? searchRes.length : '0' + searchRes.length}</p>
                    <Dropdown func={changeVal} name={code} />
                  </div>
                    <div className="inner_files mt-2">
                      {[...searchRes]
                        .sort((a, b) => {
                          let a_time = a.dateUploded.substring(0, a.dateUploded.indexOf("T"));
                          let b_time = b.dateUploded.substring(0, b.dateUploded.indexOf("T"))
                          if (code === "Oldest") {
                            return String(a_time) > String(b_time) ? 1 : -1;
                          } else if (code === "Latest") {
                            return String(a_time) > String(b_time) ? -1 : 1;
                          } else if (code === "A-Z") {
                            return a.filename.toLowerCase() >
                              b.filename.toLowerCase()
                              ? 1
                              : -1;
                          } else {
                            return a.filename.toLowerCase() >
                              b.filename.toLowerCase()
                              ? -1
                              : 1;
                          }
                        })
                        .map((file, index) => {
                          return (
                            <div key={index}>
                              <File
                                file={file}
                                showPostedBy={showPostedBy}
                                updateCurrentFileStatus={updateFileStatus}
                                exposeSensitiveFunctions={
                                  exposeSensitiveFunctions
                                }
                              />
                            </div>
                          );
                        })}
                    </div>
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
