import React, { useEffect, useState, useRef,useContext } from "react";
import axios from "axios";
import ProfilePic from "../components/ProfilePic";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUpload, faUser, faEnvelope, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from "../context/UserContext";
import Swal from 'sweetalert2';
import {useHistory} from 'react-router-dom';

const Profile = () => {
 
   let history = useHistory();
   const inputRef = useRef(null);
   const {isLoggedIn,profile,updateProfile} = useContext(UserContext);
   
   useEffect(()=>{
      if(!isLoggedIn){
          history.push('/');
          return;
      }
   },[]);

   const updateProfilePic = async(e)=>{
      try{
         console.log(e.target.files[0]);
         const resp = await axios.patch("/user/updateprofilepic",{
            profile_pic : e.target.files[0]
         },
         {
            headers : {
               "Content-Type": "multipart/form-data"
           }
         }
         );
         console.log("respppppp : ",resp);
         updateProfile(resp.data.data.url);
         Swal.fire({
            icon: 'success',
            title: 'Yayy...',
            text: resp.data.msg
          });
      }catch(err){
         console.log("Error : ",err);
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
            <div className="d-flex flex-row flex-md-col mt-2" style={{ width: '100%' }}>
               {/* profile picture */}
               <div className="prof_pic_div p-2">
                  <ProfilePic image={profile.profile_pic} height="200px" width="200px" />
                  <div className="d-flex justify-content-between mt-3" style={{ width: '200px' }}>
                     <button className="btn btn-outline-danger" style={{ width: '75px' }}><FontAwesomeIcon icon={faXmark} /></button>
                     <button className="btn btn-outline-dark" style={{ width: '75px' }} onClick={()=>inputRef.current.click()} ><FontAwesomeIcon icon={faUpload} /></button>
                     <input type="file" accept="image/*" ref={inputRef} onChange={updateProfilePic} style={{display:"none"}} />
                  </div>
               </div>

               {/* profile details */}
               <div className="prof_details_div p-2">
                   <div className="my-2"><span className="font-weight-bold"><FontAwesomeIcon icon={faUser} /> Username:</span> {profile.username}</div>
                   <div className="my-2"><span className="font-weight-bold"><FontAwesomeIcon icon={faEnvelope} /> MailID:</span> {profile.email}</div>
                   <div className="my-2"><span className="font-weight-bold"><FontAwesomeIcon icon={faCalendarDays} /> Joined Date:</span> {profile.dateJoined.substring(0, profile.dateJoined.indexOf('T'))}</div>
               </div>
            </div>
         </div>
      </>
   );
}

export default Profile;