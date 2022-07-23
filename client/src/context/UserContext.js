import React, { useState, createContext } from "react";

export const UserContext = createContext();

const UserContextProvider = ({children}) => {

    const darkTheme = {
        textColor : '#FBF7F0',
        backgroundColor : '#121212',
        primaryColor : '#BB86FC',
        surfaceColor : '#121212d9',
        theme : 'dark'
    }

    const lightTheme = {
        textColor : '#555555',
        backgroundColor : '#FBF7F0',
        primaryColor : '#D9E4DD',
        surfaceColor : '#F1FDF3',
        theme : 'light'
    }
    
    console.log("user context");

    const getLoginStatus = ()=>{
       let status = window.localStorage.getItem('isLoggedIn');
       if(status == null){
         window.localStorage.setItem('isLoggedIn',false);
         return false;
       }
       return JSON.parse(status);
    }
    
    const getDarkThemeStatus = ()=>{
        let status = window.localStorage.getItem('isDark');
        if(status == null){
          window.localStorage.setItem('isDark',false);
          return lightTheme;
        }
        status = JSON.parse(status);
        return status ? darkTheme : lightTheme;
     }


    const [isLoggedIn, setLogin] = useState(getLoginStatus);
    const [Theme,setTheme] = useState(getDarkThemeStatus);

    const setLoginStatus = (val)=>{
        window.localStorage.setItem('isLoggedIn',val);
        setLogin(val);
        return;
    }

    const setDarkThemeStatus = (val)=>{
        window.localStorage.setItem('isDark',val);
        console.log("hellllooo");
        val ? setTheme(darkTheme) : setTheme(lightTheme);
        return;
    }

    return(
        <>
         <UserContext.Provider value={{isLoggedIn,setLoginStatus,Theme,setDarkThemeStatus}}>
            {children}
         </UserContext.Provider>
        </>
    )
}

export default UserContextProvider;