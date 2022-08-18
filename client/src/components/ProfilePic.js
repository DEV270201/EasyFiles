import React from 'react';
import "../css/Profile.css";

const ProfilePic = ({image,height,width})=>{

   return(
    <>
      <div className='profile_pic' style={{backgroundImage: `url(${image})`,height:`${height}`,width:`${width}`}}>
      </div>
    </>
   )
}

export default ProfilePic;