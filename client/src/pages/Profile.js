import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import axios from "axios";
import ProfilePic from "../components/ProfilePic";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUpload, faUser, faEnvelope, faCalendarDays, faDownload } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from "../context/UserContext";
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import File from "../components/File";
import default_profile_pic from "../default";
import Dropdown from "../components/Dropdown";


const Profile = () => {

   let history = useHistory();
   const inputRef = useRef(null);
   const { isLoggedIn, profile, updateProfile, Theme, fontStyle, downloadFile } = useContext(UserContext);
   const [isLoad, setLoad] = useState(false);
   const [data, setData] = useState([]);
   const [stats, setStats] = useState({
      num_uploads: 'N.A',
      num_downloads: 'N.A'
   });
   const [code,setCode] = useState('Oldest');


   useEffect(() => {
      if (!isLoggedIn) {
         history.push('/');
         return;
      }
   }, []);

   //getting the stats data and files of the user
   useEffect(() => {
      async function getFiles() {
         try {
            let statsfiles = await axios.get('/user/statsfiles');
            setData(statsfiles.data.data.files);
            setStats({
               num_uploads: statsfiles.data.data.stats.num_upload,
               num_downloads: statsfiles.data.data.stats.num_download
            });
         } catch (err) {
            console.log("err in files : ", err);
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: err.response.data.error
            });
              //if the auth cookie expire then log the user out 
              if(err.response.data.error.toLowerCase().includes('please login')){
               window.localStorage.setItem('isLoggedIn',false);
               history.push("/user/login");
           }
         }
      }
      getFiles();
   }, []);

   const changeVal = useCallback((val)=>{
      setCode(val);
  },[code]);

   const delFile = async (file)=>{
      try{
       let resp = await axios.delete(`/files/delete/${file.grid_file_id}`);
       setData((files)=>{
          return files.filter((data)=>{
             return data.grid_file_id !== file.grid_file_id;
            })
         });
         Swal.fire({
           icon: 'success',
           title: 'Yayy...',
           text: resp.data.msg
         });
         return;
      }catch(err){
         console.log("err : ",err);
         Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.response.data.error
          });
      }
   }

   const updateProfilePic = async (e) => {
      try {
         setLoad(true);
         const resp = await axios.patch("/user/updateprofilepic", {
            profile_pic: e.target.files[0]
         },
            {
               headers: {
                  "Content-Type": "multipart/form-data"
               }
            }
         );
         updateProfile(resp.data.data.url, resp.data.data.id);
         setLoad(false);
         Swal.fire({
            icon: 'success',
            title: 'Yayy...',
            text: resp.data.msg
         });
      } catch (err) {
         setLoad(false);
         console.log("Error : ", err);
         Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.response.data.error
         });
         return;
      }
   }

   const deleteProfilePic = async (e) => {
      try {
         setLoad(true);
         const resp = await axios.post("/user/deleteprofilepic", {
            publicId: profile.p_id
         });
         updateProfile(resp.data.data.profile_pic, null);
         setLoad(false);
         Swal.fire({
            icon: 'success',
            title: 'Yayy...',
            text: resp.data.msg
         });
      } catch (err) {
         setLoad(false);
         console.log("Error : ", err);
         Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.response.data.error
         });
         return;
      }
   }

   return (
      <>
         <div className="container">
            <div className="d-flex flex-md-row flex-column mt-2 align-items-center" style={{ width: '100%' }}>
               {/* profile picture */}
               <div className="prof_pic_div p-2 mx-2">
                  {/* animator */}
                  {
                     isLoad ?
                        <div className="pic_div rounded-circle" style={{ borderTop: `2px solid ${Theme.textColor}` }}></div>
                        :
                        <div className="p-1 rounded-circle" style={{boxShadow: `1px 1px 4px ${Theme.textColor}`}}>
                           <ProfilePic image={profile.profile_pic} height="150px" width="150px" />
                        </div>
                  }
                  <div className="d-flex justify-content-between mt-3" style={{ width: '200px' }}>
                     <button className="btn btn-outline-danger" style={{ width: '75px' }} onClick={deleteProfilePic} disabled={default_profile_pic === profile.profile_pic ? true : false} ><FontAwesomeIcon icon={faXmark} /></button>
                     <button className={`btn ${Theme.theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'}`} style={{ width: '75px' }} onClick={() => inputRef.current.click()} ><FontAwesomeIcon icon={faUpload} /></button>
                     <input type="file" accept="image/*" ref={inputRef} onChange={updateProfilePic} style={{ display: "none" }} />
                  </div>
               </div>

               {/* profile details */}
               <div className="prof_details_div p-4 my-2" style={{ boxShadow: `1px 1px 4px ${Theme.textColor}` }}>
                  <div className="my-2" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}><span className="font-weight-bold"><FontAwesomeIcon icon={faUser} /> Username:</span> {profile.username}</div>
                  <div className="my-2" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}><span className="font-weight-bold"><FontAwesomeIcon icon={faEnvelope} /> MailID:</span> {profile.email}</div>
                  <div className="my-2" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}><span className="font-weight-bold"><FontAwesomeIcon icon={faCalendarDays} /> Joined Date:</span> {profile.dateJoined.substring(0, profile.dateJoined.indexOf('T'))}</div>
                  <div className="my-2" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>
                  <span className="font-weight-bold mr-1">
                     <FontAwesomeIcon icon={faUpload} /> File Uploads <span className="font-weight-lighter">(till date)</span>  :
                  </span>
                     {stats.num_uploads}
                  </div>
                  <div className="my-2" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>
                     <span className="font-weight-bold mr-1"><FontAwesomeIcon icon={faDownload} /> File Downloads <span className="font-weight-lighter">(till date)</span>  : 
                  </span> 
                     {stats.num_downloads}
                     </div>
               </div>
            </div>

            {/* files uploaded by the user */}
            {
               data.length !== 0 ?
                  <>
                     <h5 className="xs:text-center md:text-left font-weight-light my-3" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>Your Files - [ {data.length} ]</h5>
                     <Dropdown func={changeVal} name={code} />
                     <div>
                        {
                           [...data].sort((a,b)=>{
                              if(code === 'Oldest'){
                                return a.dateUploded > b.dateUploded ? 1 : -1
                              }else if(code === 'Newest'){
                                return a.dateUploded > b.dateUploded ? -1 : 1
                              }else if(code === 'A-Z'){
                                return a.filename > b.filename ? 1 : -1
                              }else{
                                return a.filename > b.filename ? -1 : 1
                              }
                             }
                             ).map((file, index) => {
                              return <div key={index}>
                                 <File file={file} func={delFile} text={"Delete"}/>
                              </div>
                           })
                        }
                     </div>
                  </>
                  :
                  <h5 className="xs:text-center md:text-left font-weight-light my-3" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>You haven't uploaded anything yet :(</h5>
            }
         </div>
      </>
   );
}

export default Profile;