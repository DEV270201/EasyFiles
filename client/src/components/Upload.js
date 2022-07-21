import React, { useRef, useState, useContext, useEffect } from "react";
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { LoginContext } from "../context/LoginContext";

//Here I am going to use uncontrolled components because I don't feel the of need controlled components.
//You can change based on your needs and requirements.

const Upload = () => {
    console.log("upload page...");
    const fref = useRef(null);
    const fnref = useRef(null);
    const history = useHistory();
    const [load, setLoad] = useState(false);
    const { isLoggedIn } = useContext(LoginContext);

    useEffect(() => {
        if (!isLoggedIn) {
            history.push('/user/login');
        }
    }, []);

    const upload = async () => {
        try {
            console.log("file : ", fref.current.files[0]);
            setLoad(true);
            let response = await axios.post('/files/upload', {
                filename: fnref.current.value,
                file: fref.current.files[0]
            }, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (response.data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Yayy...',
                    text: response.data.msg
                });

                fnref.current.value = "";
                fref.current.value = null;
                setLoad(false);
            }
        } catch (err) {
            console.log("Upload err : ", err);
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
                    <h4 className="text-center font-weight-light mt-1 mb-2">Upload your PDF here...</h4>
                    <div className="inputs">
                        <label htmlFor="file">File*</label>
                        <input type="file" className="form-control myform" id="file" aria-describedby="emailHelp" name="file" ref={fref} required />
                        <label htmlFor="Filename">File Name*</label>
                        <input type="text" className="form-control myform" id="Filename" name="filename" ref={fnref} required />
                        <button className="btn btn-outline-dark mybtn mt-3" disabled={load ? true : false} onClick={upload}>{load ? 'Loading...' : 'Upload'}</button>
                        {/* <button className="btn btn-outline-dark mybtn mt-3" onClick={hello}>Click</button> */}
                    </div>
                    <div className="mt-3">
                        <div>NOTE : </div>
                        <div>1] Name of the file should be free from the special characters.</div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Upload;