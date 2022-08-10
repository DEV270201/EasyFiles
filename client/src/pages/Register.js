import React,{useRef,useState,useEffect,useContext} from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import {useHistory} from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Button from "../components/Button";

//Here I am going to use uncontrolled components because I don't feel the of need controlled components.
//You can change based on your needs and requirements.

const Register = () => {
    console.log("register page...");
    let history = useHistory();
    const eref = useRef(null);
    const uref = useRef(null);
    const pref = useRef(null);
    const cpref = useRef(null);
    const [load,setLoad] = useState(false);
    const {isLoggedIn,Theme,fontStyle} = useContext(UserContext);

    useEffect(()=>{
        
        if(isLoggedIn){
            history.push('/');
        }
    },[]);
    
    const register = async ()=>{
       try{
         if(pref.current.value !== cpref.current.value){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match...'
              });
              return;
         }
         setLoad(true);
         let response = await axios.post("http://localhost:4000/user/register",{
            email : eref.current.value,
            username : uref.current.value,
            password : pref.current.value
         });
        console.log("response : ",response);
        if(response.data.status === 'success'){
            Swal.fire({
                icon: 'success',
                title: 'Yayy...',
                text: response.data.msg
              });
             history.push("/user/login");
        }
        setLoad(false);
       }catch(err){
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
                <div className="outer" style={{marginBottom : '35px'}}>
                    <h4 className="text-center font-weight-light mt-1 mb-2"  style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>Register Yourself...</h4>
                    <div className="inputs">
                        <div className="label" htmlFor="Email" style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>Email address*</div>
                        <input type="email" className="form-control myform" id="Email" aria-describedby="emailHelp" name="email" ref={eref} required/>
                        <div className="label" htmlFor="Username"  style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>Username*</div>
                        <input type="text" className="form-control myform" id="Username" aria-describedby="emailHelp" name="username" ref={uref} required/>
                        <div className="label" htmlFor="Password"  style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>Password*</div>
                        <input type="password" className="form-control myform" id="Password" name="password" ref={pref} required/>
                        <div className="label" htmlFor="ConfirmPassword"  style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>Confirm Password*</div>
                        <input type="password" className="form-control myform" id="ConfirmPassword" name="confirmpassword" ref={cpref} required/>
                        {
                            load ?
                            <Button text={"Loading..."} disbaled={true} fontStyle={fontStyle} theme={Theme.theme} className={"mt-3"} />
                            :
                            <Button text={"Register"} callback_func={register} disbaled={false} fontStyle={fontStyle} theme={Theme.theme} className={"mt-3"} />
                        }
                    </div>
                    <div className="mt-3">
                    <div  style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>NOTE : </div>
                    <div  style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>1] Password should be minimum 8 characters and maximum 15 characters long.</div>
                    <div  style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>2] Password should contain atleast one special character like '@' '#' or '$' only.</div>
                    <div  style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>3] Password should end with a digit only between 0-9.</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;