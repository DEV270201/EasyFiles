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
import Button from './../components/Button';
import "../css/Profile.css";


const Profile = () => {

   let history = useHistory();
   const inputRef = useRef(null);
   const { isLoggedIn, profile, updateProfile, Theme, fontStyle, downloadFile } = useContext(UserContext);
   // for profile load
   const [isLoad, setLoad] = useState(false);
   // for file load
   const [fileLoad, setFileLoad] = useState(false);
   // for update
   const [updateLoad, setUpdateLoad] = useState(false);

   const [data, setData] = useState([]);
   const [stats, setStats] = useState({
      num_uploads: 'N.A',
      num_downloads: 'N.A'
   });
   const [code, setCode] = useState('Oldest');
   const modalRef = useRef(null);
   const [file, setFile] = useState(null);
   console.log("profile page gai yeh");

   useEffect(() => {
      if (!isLoggedIn) {
         history.push('/');
         return;
      }
   }, [isLoggedIn, history]);

   //getting the stats data and files of the user
   useEffect(() => {
      async function getFiles() {
         try {
            console.log("getting files...");
            setFileLoad(true);
            let statsfiles = await axios.get('/user/statsfiles');
            setData(statsfiles.data.data.files);
            setStats({
               num_uploads: statsfiles.data.data.stats.num_upload,
               num_downloads: statsfiles.data.data.stats.num_download
            });
            setFileLoad(false);
         } catch (err) {
            console.log("err in files : ", err);
            setFileLoad(false);
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: err.response.data.error
            });
            //if the auth cookie expire then log the user out 
            if (err.response.data.error.toLowerCase().includes('please login')) {
               window.localStorage.setItem('isLoggedIn', false);
               history.push("/user/login");
            }
         }
      }
      getFiles();
   }, [history]);

   const changeVal = useCallback((val) => {
      setCode(val);
   }, []);

   // To delete the file
   const delFile = async (file) => {
      try {
         let resp = await axios.delete(`/files/delete/${file.grid_file_id}`);
         setData((files) => {
            return files.filter((data) => {
               return data.grid_file_id !== file.grid_file_id;
            })
         });
         Swal.fire({
            icon: 'success',
            title: 'Yayy...',
            text: resp.data.msg
         });
         return;
      } catch (err) {
         console.log("err : ", err);
         Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.response.data.error
         });
      }
   }

   // To update the profile pic
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

   // To delete the profile picture
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

   // To download the file
   const download_file = async (file) => {
      let download_num = await downloadFile(file);
      setStats({ ...stats, num_downloads: download_num });
   }

   // To show the modal
   const visibility = (file) => {
      console.log("file : ", file);
      modalRef.current.classList.add('show');
      modalRef.current.classList.add('show_modal');
      setFile(file);
   }

   // To hide away the modal
   const fadeAway = () => {
      modalRef.current.classList.remove('show');
      modalRef.current.classList.remove('show_modal');
      setFile(null);
   }

   // To change the status of the file
   const updateStatus = async()=>{
      try{
         console.log("updating..");
         setUpdateLoad(true);
         const resp = await axios.patch("/files/updateStatus", {
            filename: file.filename,
            isPrivate: file.isPrivate ? false : true
         });
         //updating the file array
         setData((data)=>{
            return data.map((file_obj)=>{
              if(file.id === file_obj.id){
                file_obj.isPrivate = !file_obj.isPrivate
              }
              return file_obj;
            });
         })
         // hiding the modal once the update is done
         modalRef.current.classList.remove('show');
         modalRef.current.classList.remove('show_modal');
         setUpdateLoad(false);
         Swal.fire({
            icon: 'success',
            title: 'Yayy...',
            text: resp.data.msg
         });
      }catch(err){
         setUpdateLoad(false);
         console.log("Error in updatestatus : ", err);
         Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong.Please try in sometime!'
         });
         return;
      }
   }

   return (
      <>
         <div className="container">
            {/* modal container */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
               <div className="modal-dialog">
                  <div className="modal-content">
                     <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Update Status</h5>
                        <button type="button" className="close" onClick={fadeAway} data-dismiss="modal" aria-label="Close">
                           <span aria-hidden="true">&times;</span>
                        </button>
                     </div>
                     <div className="modal-body">
                        <div style={{fontFamily: `${fontStyle}`}}><b>{file && file.filename.substring(0, file.filename.indexOf('-'))}</b> is currently <b>{file && (file.isPrivate ? 'Private' : 'Public')}.</b></div>
                        <div style={{fontFamily: `${fontStyle}`}}> Do you want to change the status to <b>{file && (file.isPrivate ? 'Public' : 'Private')}</b> ??</div>
                        <div className="mt-1" style={{fontFamily: `${fontStyle}`}}><b>NOTE:</b></div>
                        <div style={{fontFamily: `${fontStyle}`,color:'red'}}><b>Public - accessible to everyone</b></div>
                        <div style={{fontFamily: `${fontStyle}`,color:'red'}}><b>Private - accessible only to you</b></div>
                     </div>
                     <div className="modal-footer">
                        {
                           updateLoad ? 
                           <Button disabled={true} text={"Updating"} fontStyle={fontStyle} className={"btn-outline-primary"} />
                           :
                           <Button disabled={false} text={"Update"} callback_func={updateStatus} fontStyle={fontStyle} className={"btn-outline-primary"} />
                        }
                     </div>
                  </div>
               </div>
            </div>

            {/* profile page  */}
            <div className="d-flex flex-md-row flex-column mt-2 align-items-center" style={{ width: '100%' }}>
               {/* profile picture */}
               <div className="prof_pic_div p-2 mx-2">
                  {/* animator */}
                  {
                     isLoad ?
                        <div className="spin_div rounded-circle" style={{ borderTop: `2px solid ${Theme.textColor}` }}></div>
                        :
                        <div className="p-1 rounded-circle" style={{ boxShadow: `1px 1px 4px ${Theme.textColor}` }}>
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
            fileLoad ? 
            <h5 className="xs:text-center md:text-left font-weight-light my-3" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>Loading..it may take a while..</h5>
            :
               (data.length !== 0 ?
                  <>
                     <h5 className="xs:text-center md:text-left font-weight-light my-3" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>Your Files - [ {data.length} ]</h5>
                     <Dropdown func={changeVal} name={code} />
                     <div>
                        {
                           [...data].sort((a, b) => {
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
                                 <File file={file} func={download_file} func2={delFile} text={"Download"} text2={"Delete"} text3={"Status"} func3={visibility} />
                              </div>
                           })
                        }
                     </div>
                  </>
                  :
                  <h5 className="text-center font-weight-light my-3" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>You haven't uploaded anything yet :(</h5>)
            }
         </div>
      </>
   );
}

export default Profile;