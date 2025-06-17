import { useRef, useState, useContext, useEffect } from "react";
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Button from "../components/Button";

//Here I am going to use uncontrolled components because I don't feel the of need controlled components.
//You can change based on your needs and requirements.

const Upload = () => {
    console.log("upload page...");
    const fref = useRef(null);
    const fnref = useRef(null);
    const [status,setStatus] = useState('Private');
    const history = useHistory();
    const [load, setLoad] = useState(false);
    const { isLoggedIn, Theme, fontStyle, incrementUploads } = useContext(UserContext);

    useEffect(() => {
        if (!isLoggedIn) {
            history.push('/user/login');
        }
    }, [isLoggedIn, history]);

    const changeStatus = (e)=>{
        setStatus(e.target.value);
    }

    const upload = async () => {
        try {
            console.log("file : ", fref.current.files[0]);
            setLoad(true);

            let response = await axios.post('/api/files/upload', {
                filename: fnref.current.value,
                isPrivate: status.includes('Private') ? true : false,
                file: fref.current.files[0],
            }, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (response.data.status === 'success') {
                incrementUploads(); //incrementing per user upload metric
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
            //if the auth cookie expire then log the user out 
            if (err.response.data.error.toLowerCase().includes('please login')) {
                window.localStorage.setItem('isLoggedIn', false);
                history.push("/user/login");
            }
            return;
        }
    }

    return (
        <>
            <div className="container p-3">
                <div className="outer">
                    <h4 className="text-center font-weight-light mt-1 mb-2" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>Upload your file here...</h4>
                    <div className="inputs">
                        <div className="label font-weight-bold" htmlFor="file" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>File*</div>
                        <input type="file" className="form-control myform" id="file" aria-describedby="emailHelp" name="file" ref={fref} required />
                        <div className="label font-weight-bold" htmlFor="Filename" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>File Name*</div>
                        <input type="text" className="form-control myform" id="Filename" name="filename" ref={fnref} required />
                        <div className="d-flex flex-column align-items-start mt-2">
                            <h6 className="font-weight-bold" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>Status:</h6>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="isPrivate" id="ip1" value={'Private'} onChange={changeStatus} checked={status.includes('Private') ? true : false} />
                                <div style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>
                                    Private
                                </div>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="isPrivate" id="ip2" value={'Public'} onChange={changeStatus} checked={status.includes('Public') ? true : false} />
                                <div style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>
                                    Public
                                </div>
                            </div>
                        </div>
                        {
                            load ?
                                <Button text={"Uploading..."} disbaled={true} fontStyle={fontStyle} theme={Theme.theme} className={"mt-3"} />
                                :
                                <Button text={"Upload"} callback_func={upload} disbaled={false} fontStyle={fontStyle} theme={Theme.theme} className={"mt-3"} />
                        }
                    </div>
                    <div className="mt-3">
                        <div style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>NOTE : </div>
                        <div style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>1] Name of the file should be free from the special characters.</div>
                        <div style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>2] If you set the status of the file as <b>Private</b> then nobody would have access to it.</div>
                        <div style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>3] if you set the status of the file as <b>Public</b> then everyone can have access to it.</div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Upload;