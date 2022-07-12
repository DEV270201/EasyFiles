import React from "react";

const Register = () => {
    return (
        <>
            <div className="container p-3">
                <div className="outer">
                    <h4 className="text-center font-weight-light mt-1 mb-2">Register Yourself...</h4>
                    <div className="inputs">
                        <label htmlFor="Email">Email address*</label>
                        <input type="email" className="form-control myform" id="Email" aria-describedby="emailHelp" name="email" required/>
                        <label htmlFor="Username">Username*</label>
                        <input type="text" className="form-control myform" id="Username" aria-describedby="emailHelp" name="username" required/>
                        <label htmlFor="Password">Password*</label>
                        <input type="password" className="form-control myform" id="Password" name="password" required/>
                        <label htmlFor="ConfirmPassword">Confirm Password*</label>
                        <input type="password" className="form-control myform" id="ConfirmPassword" name="confirmpassword" required/>
                        <button className="btn btn-outline-dark mybtn mt-3">Register</button>
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