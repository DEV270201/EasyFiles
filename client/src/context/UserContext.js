import { useState, createContext, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  let clearTimeoutID = useRef(null);
  const history = useHistory();

  //fetching the login status of the user
  const getLoginStatus = () => {
    let status = window.localStorage.getItem("isLoggedIn");
    if (status == null) {
      window.localStorage.setItem("isLoggedIn", false);
      return false;
    }
    return JSON.parse(status);
  };

  const [isLoggedIn, setLogin] = useState(getLoginStatus);
  const [profile, setProfile] = useState({
    username: "",
    profile_pic: "",
    email: "",
    dateJoined: "",
    p_id: null,
    num_upload: 0,
    num_download: 0,
  });
  const analyticsRef = useRef({
    uploadIncrement: 0,
    downloadIncrement: 0,
  });

  //fetching the profile of the user once logged in
  async function fetchProfile() {
    try {
      let resp = await axios.get("/api/user/profile", {
        withCredentials: true,
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
    if (val) fetchProfile();
    setLogin(val);
    return;
  };

  //updating the profile picture
  const updateProfile = (url, id) => {
    setProfile({ ...profile, profile_pic: url, p_id: id });
  };

  //function for updating user analytics
  const updateAnalytics = (currentKey, updatedKey) => {
    let currentVal = profile[currentKey];
    currentVal++;
    console.log("currentkey : ", currentKey);
    console.log("currentVal: ", currentVal);
    let updatedVal = analyticsRef.current[updatedKey];
    updatedVal++;
    setProfile({ ...profile, [currentKey]: currentVal });
    analyticsRef.current[updatedKey] = updatedVal;

    if (clearTimeoutID.current) {
      clearTimeout(clearTimeoutID.current);
      clearTimeoutID.current = null;
    }

    clearTimeoutID.current = setTimeout(() => {
      triggerAnalyticsFlush();
    }, 5000);

    return;
  };

  const triggerAnalyticsFlush = async () => {
    try {
      //make api request for flushing
      console.log("log: ", analyticsRef.current);
      await axios.post("/api/user/updateuserstats", analyticsRef.current);
      analyticsRef.current = {
        uploadIncrement: 0,
        downloadIncrement: 0,
      };
    } catch (err) {
      console.log("Error in flushing analytics: ", err);
      //implement retries and pushing to queue
      return;
    }
  };

  const logout = async () => {
    try {
      if (clearTimeoutID.current) {
        clearTimeout(clearTimeoutID.current);
        clearTimeoutID.current = null;
      }
      let response = await axios.post(
        "/api/user/logout",
        analyticsRef.current,
        {
          withCredentials: true,
        }
      );
      setLogin(false);
      analyticsRef.current = {
        uploadIncrement: 0,
        downloadIncrement: 0,
      };
      if (response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Yayy...",
          text: response.data.msg,
        });
        history.replace("/");
      }
    } catch (err) {
      console.log("logout err : ", err);
    } 
  };

  return (
    <>
      <UserContext.Provider
        value={{
          isLoggedIn,
          setLoginStatus,
          profile,
          updateProfile,
          updateAnalytics,
          logout,
        }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};

export default UserContextProvider;
