import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {

  const darkTheme = {
    textColor: '#FBF7F0',
    backgroundColor: '#121212',
    primaryColor: '#BB86FC',
    surfaceColor: '#2C2C2A',
    theme: 'dark'
  }

  const lightTheme = {
    textColor: '#555555',
    backgroundColor: '#F8F9F5',
    primaryColor: '#8ABAD3FF',
    surfaceColor: '#f8f8ff',
    theme: 'light'
  }

  console.log("user context");

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
      let resp = await axios.get('/user/profile');
      console.log("resp : ", resp);
      setProfile(resp.data.data);
    } catch (err) {
      console.log("fetching profile err : ", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong.Please try again later'
      });
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

  return (
    <>
      <UserContext.Provider value={{ isLoggedIn, setLoginStatus, Theme, setDarkThemeStatus, profile, updateProfile, fontStyle,setTheFontStyle}}>
        {children}
      </UserContext.Provider>
    </>
  )
}

export default UserContextProvider;