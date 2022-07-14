import React, { useState, createContext } from "react";

export const LoginContext = createContext();

const LoginContextProvider = ({children}) => {
    
    console.log("login context");

    const getStatus = ()=>{
       let status = window.localStorage.getItem('isLoggedIn');
       if(status == null){
         window.localStorage.setItem('isLoggedIn',false);
         return false;
       }
       return JSON.parse(status);
    }

    const [isLoggedIn, setLogin] = useState(getStatus);

    const setLoginStatus = (val)=>{
        window.localStorage.setItem('isLoggedIn',val);
        setLogin(val);
        return;
    }

    return(
        <>
         <LoginContext.Provider value={{isLoggedIn,setLoginStatus}}>
            {children}
         </LoginContext.Provider>
        </>
    )
}

export default LoginContextProvider;