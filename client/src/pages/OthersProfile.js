import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import ProfilePic from "../components/ProfilePic";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUser, faCalendarDays, faDownload } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from "../context/UserContext";
import Swal from 'sweetalert2';
import { useHistory,useParams } from 'react-router-dom';
import File from "../components/File";
import Dropdown from "../components/Dropdown";


const OthersProfile = () => {

   let history = useHistory();
   const { isLoggedIn, Theme, fontStyle, downloadFile } = useContext(UserContext);
   const [isLoad, setLoad] = useState(true);
   const [data, setData] = useState({});
   const [code, setCode] = useState('Oldest');
   
   //getting the username
   const user = useParams();

   useEffect(() => {
      if (!isLoggedIn) {
         history.push('/');
         return;
      }
   }, [isLoggedIn, history]);

   //getting the data and files of the user
   useEffect(() => {
      async function getUserData() {
         try {
            console.log("getting data...");
            setLoad(true);
            let user_data = await axios.get(`/user/profile/${user.user}`);
            setData(user_data.data.data);
            setLoad(false);
         } catch (err) {
            setLoad(false);
            setData(null);
            console.log("err in others profile : ", err);
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: 'I guess there is some issue!!'
            });
            //if the auth cookie expire then log the user out 
            if (err.response.data.error.toLowerCase().includes('please login')) {
               window.localStorage.setItem('isLoggedIn', false);
               history.push("/user/login");
            }
         }
      }
      getUserData();
   }, [history,user]);

   const changeVal = useCallback((val) => {
      setCode(val);
   }, []);

   const download_file = async (file) => {
      await downloadFile(file);
   }

   return (
      <>
         <div className="container">
            {
               isLoad ?
                  <div className="d-flex justify-content-center align-items-center">
                     <h5 className="text-center font-weight-light" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>Loading....It may take up a while..</h5>
                  </div>
                  :
                  (
                     data !== null ?
                        <>
                           <div className="d-flex flex-md-row flex-column mt-2 align-items-center" style={{ width: '100%' }}>
                              {/* profile picture */}
                              <div className="prof_pic_div p-2 mx-2">
                                 {
                                    <div className="p-1 rounded-circle" style={{ boxShadow: `1px 1px 4px ${Theme.textColor}` }}>
                                       <ProfilePic image={data.userdata.profile_pic} height="150px" width="150px" />
                                    </div>
                                 }
                              </div>

                              {/* profile details */}
                              <div className="prof_details_div p-4 my-2" style={{ boxShadow: `1px 1px 4px ${Theme.textColor}` }}>
                                 <div className="my-2" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}><span className="font-weight-bold"><FontAwesomeIcon icon={faUser} /> Username:</span> {data.userdata.username}</div>
                                 <div className="my-2" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}><span className="font-weight-bold"><FontAwesomeIcon icon={faCalendarDays} /> Joined Date:</span> {data.userdata.dateJoined.substring(0, data.userdata.dateJoined.indexOf('T'))}</div>
                                 <div className="my-2" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>
                                    <span className="font-weight-bold mr-1">
                                       <FontAwesomeIcon icon={faUpload} /> File Uploads <span className="font-weight-lighter">(till date)</span>  :
                                    </span>
                                    {data.userdata.num_upload}
                                 </div>
                                 <div className="my-2" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>
                                    <span className="font-weight-bold mr-1"><FontAwesomeIcon icon={faDownload} /> File Downloads <span className="font-weight-lighter">(till date)</span>  :
                                    </span>
                                    {data.userdata.num_download}
                                 </div>
                              </div>
                           </div>

                           {/* files uploaded by the user */}
                           {
                              data.filedata.length !== 0 ?
                                 <>
                                    <h5 className="xs:text-center md:text-left font-weight-light my-3" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>Their Files - [ {data.filedata.length} ]</h5>
                                    <Dropdown func={changeVal} name={code} />
                                    <div>
                                       {
                                          [...data.filedata].sort((a, b) => {
                                             if (code === 'Oldest') {
                                                return a.dateUploded > b.dateUploded ? 1 : -1
                                             } else if (code === 'Newest') {
                                                return a.dateUploded > b.dateUploded ? -1 : 1
                                             } else if (code === 'A-Z') {
                                                return a.filename > b.filename ? 1 : -1
                                             } else {
                                                return a.filename > b.filename ? -1 : 1
                                             }
                                          }
                                          ).map((file, index) => {
                                             return <div key={index}>
                                                <File file={file} func={download_file} text={"Download"} showPostedBy={false} />
                                             </div>
                                          })
                                       }
                                    </div>
                                 </>
                                 :
                                 <h5 className="text-center font-weight-light my-3" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>They haven't uploaded anything yet :(</h5>
                           }

                        </>
                        :
                        <div className="d-flex justify-content-center align-items-center">
                           <h5 className="text-center font-weight-light" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>Sorry, coudn't fetch the details :(</h5>
                        </div>
                  )
            }
         </div>
      </>
   );
}

export default OthersProfile;