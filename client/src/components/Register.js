import React,{useRef,useState} from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import {useHistory} from 'react-router-dom';

//here i am going to use uncontrolled components becuase i don't need controlled components.
//you can change based on your needs and requirements

const Register = () => {
    let history = useHistory();
    const eref = useRef(null);
    const uref = useRef(null);
    const pref = useRef(null);
    const cpref = useRef(null);
    const [load,setLoad] = useState(false);
    
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
        console.log("Register Err : ",err);
        setLoad(false);
       }
    }
    return (
        <>
            <div className="container p-3">
                <div className="outer" style={{marginBottom : '35px'}}>
                    <h4 className="text-center font-weight-light mt-1 mb-2">Register Yourself...</h4>
                    <div className="inputs">
                        <label htmlFor="Email">Email address*</label>
                        <input type="email" className="form-control myform" id="Email" aria-describedby="emailHelp" name="email" ref={eref} required/>
                        <label htmlFor="Username">Username*</label>
                        <input type="text" className="form-control myform" id="Username" aria-describedby="emailHelp" name="username" ref={uref} required/>
                        <label htmlFor="Password">Password*</label>
                        <input type="password" className="form-control myform" id="Password" name="password" ref={pref} required/>
                        <label htmlFor="ConfirmPassword">Confirm Password*</label>
                        <input type="password" className="form-control myform" id="ConfirmPassword" name="confirmpassword" ref={cpref} required/>
                        <button className="btn btn-outline-dark mybtn mt-3" disabled={load ? true : false} onClick={register}>{load ? 'Loading...' : 'Register'}</button>
                    </div>
                    <div className="mt-3">
                    <div>NOTE : </div>
                    <div>1] Password should be minimum 8 characters and maximum 15 characters long.</div>
                    <div>2] Password should contain atleast one special character like '@' '#' or '$' only.</div>
                    <div>3] Password should end with a digit only between 0-9.</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;