import React,{useRef,useState,useContext,useEffect} from "react";
import Swal from 'sweetalert2';
import {useHistory} from 'react-router-dom';
import axios from "axios";
import { LoginContext } from "../context/LoginContext";

//Here I am going to use uncontrolled components because I don't feel the of need controlled components.
//You can change based on your needs and requirements.

const Login = () => {
    console.log("login page...");
    const uref = useRef(null);
    const pref = useRef(null);
    const history = useHistory();
    const [load,setLoad] = useState(false);
    const {isLoggedIn,setLoginStatus} = useContext(LoginContext);

    useEffect(()=>{
       if(isLoggedIn){
        history.push('/');
       }
    },[]);

    const login = async ()=>{
       try{
       setLoad(true);
         let response = await axios.post('/user/login',{
            username : uref.current.value,
            password : pref.current.value
         });
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
                    <h4 className="text-center font-weight-light mt-1 mb-2">Login Yourself...</h4>
                    <div className="inputs">
                        <label htmlFor="Username">Username*</label>
                        <input type="text" className="form-control myform" id="Username" aria-describedby="emailHelp" name="username" ref={uref} required/>
                        <label htmlFor="Password">Password*</label>
                        <input type="password" className="form-control myform" id="Password" name="password" ref={pref} required/>
                        <button className="btn btn-outline-dark mybtn mt-3" disabled={load ? true : false} onClick={login}>{load ? 'Loading...' : 'Login'}</button>
                        {/* <button className="btn btn-outline-dark mybtn mt-3" onClick={hello}>Click</button> */}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login;