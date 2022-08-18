import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import {saveAs} from "file-saver";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  
  const darkTheme = {
    textColor: '#E6E6F2',
    backgroundColor: '#14141A',
    primaryColor: '#BB86FC',
    surfaceColor: '#2C2C2A',
    theme: 'dark'
  }

  const lightTheme = {
    textColor: '#14141A',
    backgroundColor: '#E6E6F2',
    primaryColor: '#483248',
    surfaceColor: '#BFB9FA',
    theme: 'light'
  }

  // console.log("user context");

  const getLoginStatus = () => {
    let status = window.localStorage.getItem('isLoggedIn');
    if (status == null) {
      window.localStorage.setItem('isLoggedIn', false);
      return false;
    }
    return JSON.parse(status);
  }

  const getDarkThemeStatus = () => {
    let status = window.localStorage.getItem('isDark');
    if (status == null) {
      window.localStorage.setItem('isDark', false);
      return lightTheme;
    }
    status = JSON.parse(status);
    //if any user deliberately adds any random value in the localstorage
    if(typeof(status) != "boolean"){
        status = false;
        window.localStorage.setItem('isDark', false);
    }
    return status ? darkTheme : lightTheme;
  }

  const getfontStyle = ()=>{
    let fs = window.localStorage.getItem('fs');
    if (fs == null) {
      window.localStorage.setItem('fs', "'Comfortaa', cursive");
      return "'Comfortaa', cursive";
    }
    // fs = JSON.parse(fs);
    console.log("type : ",typeof(fs));
    return String(fs);
  }


  const [isLoggedIn, setLogin] = useState(getLoginStatus);
  const [Theme, setTheme] = useState(getDarkThemeStatus);
  const [profile, setProfile] = useState({
    username: '',
    profile_pic: '',
    email: '',
    dateJoined: '',
    p_id: null,
  });
  const [fontStyle,setFontStyle] = useState(getfontStyle);

  async function fetchProfile() {
    try {
      console.log("made request..");
      let resp = await axios.get('/user/profile');
      console.log("resp : ", resp);
      setProfile(resp.data.data);
    } catch (err) {
      console.log("fetching profile err : ", err.response.data.error);
      window.localStorage.setItem("isLoggedIn",false);
      window.location.reload();
      return;
    }
  }

  useEffect(() => {
    console.log("login : ", isLoggedIn);
    if (isLoggedIn) {
      console.log("fired1");
      fetchProfile();
    }
  }, []);

  const setLoginStatus = (val) => {
    window.localStorage.setItem('isLoggedIn', val);
    if (val) {
      console.log("s: ", val);
      console.log("fired2");
      fetchProfile();
    }
    setLogin(val);
    return;
  }

  const setDarkThemeStatus = (val) => {
    window.localStorage.setItem('isDark', val);
    console.log("hellllooo");
    val ? setTheme(darkTheme) : setTheme(lightTheme);
    return;
  }

  const updateProfile = (url,id)=>{
    console.log("id : ",id);
    setProfile({...profile,profile_pic : url,p_id:id});
  }

  const setTheFontStyle = (val)=>{
    window.localStorage.setItem('fs', val);
    setFontStyle(val);
  }


  //function for downloading the file
  const downloadFile = async (file) => {
    try {
      //recieving the file from the server
      let resp = await axios.get(`/files/${file.filename}`, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer'
      });
      const { data } = resp;
      //downloading the file and saving it to the device
      const blob = new Blob([data]);
      saveAs(blob,file.filename.substring(0, file.filename.indexOf('@'))+"."+file.filetype);
      Swal.fire({
        icon: 'success',
        title: 'Yayy...',
        text: 'File downloaded successfully!'
      });
      // console.log("resp : ",resp);
    } catch (err) {
      console.log("err in file : ", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response.data.error
      });
    }
  }

  return (
    <>
      <UserContext.Provider value={{ isLoggedIn, setLoginStatus, Theme, setDarkThemeStatus, profile, updateProfile, fontStyle,setTheFontStyle,downloadFile}}>
        {children}
      </UserContext.Provider>
    </>
  )
}

export default UserContextProvider;