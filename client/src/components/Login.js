import React from "react";

const Login = () => {
    return (
        <>
            <div className="container p-3">
                <div className="outer">
                    <h4 className="text-center font-weight-light mt-1 mb-2">Login Yourself...</h4>
                    <div className="inputs">
                        <label htmlFor="Username">Username*</label>
                        <input type="text" className="form-control myform" id="Username" aria-describedby="emailHelp" name="username" required/>
                        <label htmlFor="Password">Password*</label>
                        <input type="password" className="form-control myform" id="Password" name="password" required/>
                        <button className="btn btn-outline-dark mybtn mt-3">Login</button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login;