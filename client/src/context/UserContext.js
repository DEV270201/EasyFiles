import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const darkTheme = {
    textColor: "#E6E6F2",
    backgroundColor: "#14141A",
    primaryColor: "#BB86FC",
    surfaceColor: "#2C2C2A",
    theme: "dark",
  };

  const lightTheme = {
    textColor: "#14141A",
    backgroundColor: "#E6E6F2",
    primaryColor: "#483248",
    surfaceColor: "#dbd7d2",
    theme: "light",
  };

  //fetching the login status of the user
  const getLoginStatus = () => {
    let status = window.localStorage.getItem("isLoggedIn");
    if (status == null) {
      window.localStorage.setItem("isLoggedIn", false);
      return false;
    }
    return JSON.parse(status);
  };

  //fetching the theme of the user
  const getDarkThemeStatus = () => {
    let status = window.localStorage.getItem("isDark");
    if (status == null) {
      window.localStorage.setItem("isDark", false);
      return lightTheme;
    }
    status = JSON.parse(status);
    //if any user deliberately adds any random value in the localstorage
    if (typeof status != "boolean") {
      status = false;
      window.localStorage.setItem("isDark", false);
    }
    return status ? darkTheme : lightTheme;
  };

  //fetching the fontstyle for the application of the user
  const getfontStyle = () => {
    let fs = window.localStorage.getItem("fs");
    if (fs == null) {
      window.localStorage.setItem("fs", "'Comfortaa', cursive");
      return "'Comfortaa', cursive";
    }
    // fs = JSON.parse(fs);
    console.log("type : ", typeof fs);
    return String(fs);
  };

  const [isLoggedIn, setLogin] = useState(getLoginStatus);
  const [Theme, setTheme] = useState(getDarkThemeStatus);
  const [profile, setProfile] = useState({
    username: "",
    profile_pic: "",
    email: "",
    dateJoined: "",
    p_id: null,
    num_upload: 0,
    num_download: 0,
  });
  const [fontStyle, setFontStyle] = useState(getfontStyle);

  //fetching the profile of the user once logged in
  async function fetchProfile() {
    try {
      let resp = await axios.get("/api/user/profile",{
        withCredentials: true
      });
      setProfile(resp.data.data);
    } catch (err) {
      console.log("fetching profile err : ", err.response.data.error);
      window.localStorage.setItem("isLoggedIn", false);
      window.location.reload();
      return;
    }
  }

  useEffect(() => {
    console.log("profile : ", profile);
  }, [profile]);

  useEffect(() => {
    // console.log("login : ", isLoggedIn);
    if (isLoggedIn) fetchProfile();
  }, [isLoggedIn]);

  //setting the login status
  const setLoginStatus = (val) => {
    window.localStorage.setItem("isLoggedIn", val);
    if (val)
      fetchProfile();
    setLogin(val);
    return;
  };

  //setting the theme
  const setDarkThemeStatus = (val) => {
    window.localStorage.setItem("isDark", val);
    val ? setTheme(darkTheme) : setTheme(lightTheme);
    return;
  };

  //setting the font style for the user
  const setTheFontStyle = (val) => {
    window.localStorage.setItem("fs", val);
    setFontStyle(val);
  };

  //updating the profile picture
  const updateProfile = (url, id) => {
    setProfile({ ...profile, profile_pic: url, p_id: id });
  };

  const incrementDownloads = () => {
    setProfile({ ...profile, num_download: profile.num_download + 1 });
    return;
  };

  const incrementUploads = () => {
    setProfile({ ...profile, num_upload: profile.num_upload + 1 });
    return;
  };

  return (
    <>
      <UserContext.Provider
        value={{
          isLoggedIn,
          setLoginStatus,
          Theme,
          setDarkThemeStatus,
          profile,
          updateProfile,
          fontStyle,
          setTheFontStyle,
          incrementDownloads,
          incrementUploads,
        }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};

export default UserContextProvider;
