import React,{useEffect} from 'react';
import "../css/Profile.css";

const ProfilePic = ({image,height,width})=>{
   
  useEffect(()=>{
    console.log("profile pic ek")
  },[]);

  useEffect(()=>{
    console.log("profile pic baar baar")
  });

   return(
    <>
      <div className='profile_pic' style={{backgroundImage: `url(${image})`,height:`${height}`,width:`${width}`}}>
      </div>
    </>
   )
}

export default ProfilePic;