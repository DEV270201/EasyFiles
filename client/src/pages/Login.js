import React,{useRef,useState,useContext,useEffect} from "react";
import Swal from 'sweetalert2';
import {useHistory,NavLink} from 'react-router-dom';
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Button from "../components/Button";

//Here I am going to use uncontrolled components because I don't feel the of need controlled components.
//You can change based on your needs and requirements.

const Login = () => {
    console.log("login page...");
    const uref = useRef(null);
    const pref = useRef(null);
    const history = useHistory();
    const [load,setLoad] = useState(false);
    const {isLoggedIn,setLoginStatus,Theme,fontStyle} = useContext(UserContext);

    useEffect(()=>{
        if(isLoggedIn){
            history.push('/');
        }
    },[isLoggedIn,history]);
    
    const login = async ()=>{
       try{
       setLoad(true);
         let response = await axios.post('/user/login',{
            username : uref.current.value,
            password : pref.current.value
         });
         console.log('login : ',response);
         if(response.data.status === 'success'){
            Swal.fire({
                icon: 'success',
                title: 'Yayy...',
                text: response.data.msg
              });
             history.push("/");
             setLoginStatus(true);
        }
       }catch(err){
        console.log("Login err : ",err);
        setLoad(false);
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
            <div className="container p-3">
                <div className="outer">
                    <h4 className="text-center font-weight-light mt-1 mb-2"  style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>Login Yourself...</h4>
                    <div className="inputs">
                        <div className="label" htmlFor="Username" style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>Username/Email*</div>
                        <input type="text" className="form-control myform" id="Username" aria-describedby="emailHelp" name="username" ref={uref} required/>
                        <div className="label" htmlFor="Password" style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>Password*</div>
                        <input type="password" className="form-control myform" id="Password" name="password" ref={pref} required/>
                        {
                            load ?
                            <Button text={"Loading..."} disabled={true} fontStyle={fontStyle} theme={Theme.theme} className={"mt-3"} />
                            :
                            <Button text={"Login"} callback_func={login} disabled={false} fontStyle={fontStyle} theme={Theme.theme} className={"mt-3"} />
                        }
                    </div>
                    <p className="my-1 font-weight-bold"  style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>
                    Don't have an account? <NavLink to={"/user/register"}>Register</NavLink>
                    </p>
                </div>
            </div>
        </>
    );
}
export default Login;