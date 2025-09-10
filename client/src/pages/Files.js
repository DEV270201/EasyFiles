import { useEffect, useState, useContext } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { useHistory } from 'react-router-dom';
import '../css/Files.css';
import FileIterator from '../components/FileIterator';

const Files = () => {
    const [files, setFiles] = useState([]);
    const { isLoggedIn } = useContext(UserContext);
    const {Theme, fontStyle} = useContext(ThemeContext);
    let history = useHistory();
    const [isLoad, setLoad] = useState(true);


    useEffect(() => {
        if (!isLoggedIn) {
            return history.push('/');
        }
    }, [isLoggedIn, history]);


    useEffect(() => {
        async function getFiles() {
            try {
                let files = await axios.get('/api/files');
                setLoad(false);
                console.log("files : ", files.data.data);
                setFiles(files.data.data);
            } catch (err) {
                console.log("err in files : ", err);
                setLoad(false);
                setFiles(null);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.data.error
                });
                //if the auth cookie expire then log the user out 
                if (err.response.data.error.toLowerCase().includes('please login')) {
                    window.localStorage.setItem('isLoggedIn', false);
                    history.push("/user/login");
                    return;
                }
            }
        }
        getFiles();
    }, [history]);

    return (
        <>
            <div className="container p-3">
                <div className="outer" style={{ marginBottom: '35px' }}>
                    {
                        isLoad ?
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h5 className="text-center font-weight-light" style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}>Loading....It may take a while...</h5>
                                </div>
                            </>
                            :
                        <FileIterator filesArray={files} showPostedBy={true}/>
                    }
                </div>
            </div>
        </>
    );
}

export default Files;