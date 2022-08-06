import React, { useEffect, useState, useContext } from 'react';
import File from "../components/File";
import axios from "axios";
import Swal from 'sweetalert2';
import Search from '../components/Search';
import { UserContext } from '../context/UserContext';
import {useHistory} from 'react-router-dom';
import '../css/Files.css';


const Files = () => {
    const [files, setFiles] = useState([]);
    const [searchRes,setSearchRes] = useState("");
    const {Theme,isLoggedIn} = useContext(UserContext);
    let history = useHistory();

    useEffect(()=>{
        if(!isLoggedIn){
            return history.push('/');
        }
    },[]);

    useEffect(() => {
        console.log("mounted");
        async function getFiles(){
            try{
               let files = await axios.get('/files');
               console.log("files : ",files.data.data);
               setFiles(files.data.data);
            }catch(err){
                console.log("err in files : ",err);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.data.error
                });
            }
        }
        getFiles();
    }, []);

    useEffect(()=>{
       setSearchRes(files);
    },[files]);
    
    const searchpdf = (val)=>{
        console.log(val);
       let results = !val ? files : files.filter((file)=> { return file.filename.toLowerCase().includes(val.toLocaleLowerCase());});
        setSearchRes(results);
    }

    return (
        <>
            <div className="container p-3">
                <div className="outer" style={{ marginBottom: '35px' }}>
                    <div className="mt-2">
                        {
                            files.length === 0 ?
                                <>
                                    <h4 className="text-center font-weight-light mt-2" style={{color : `${Theme.textColor}`}}>No PDF files yet :(</h4>
                                </>
                                :
                                <>
                                    <div className='files_search'>
                                        <Search searchpdf={searchpdf}/>
                                    </div>
                                     {
                                         searchRes.length===0 ? 
                                         <> 
                                    <h4 className="text-center font-weight-light my-5" style={{color : `${Theme.textColor}`}}>No such file found :(</h4>
                                       </>
                                        :
                                        <>
                                        <h4 className="xs:text-center md:text-left font-weight-light my-4" style={{color : `${Theme.textColor}`}}>Explore new PDF files!</h4>
                                       <div className='inner_files'>
                                        {
                                           searchRes.map((file, index) => {
                                               return <div key={index}>
                                                   <File file={file} />
                                               </div>
                                           }) 
                                        }
                                       </div>     
                                        </>
                                    }
                                </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Files;