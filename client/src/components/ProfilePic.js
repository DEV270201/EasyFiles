import React from 'react';
import "../css/ProfilePic.css";

const ProfilePic = ({image})=>{
   return(
    <>
      <div className='profile_pic' style={{backgroundImage : `url(${image})`}}>
      </div>
    </>
   )
}

export default ProfilePic;