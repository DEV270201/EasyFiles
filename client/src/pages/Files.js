import React, { useEffect, useState, useContext,useCallback } from 'react';
import File from "../components/File";
import axios from "axios";
import Swal from 'sweetalert2';
import Search from '../components/Search';
import { UserContext } from '../context/UserContext';
import {useHistory} from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import '../css/Files.css';

const Files = () => {
    const [files, setFiles] = useState([]);
    const [searchRes,setSearchRes] = useState("");
    const {Theme,isLoggedIn,fontStyle,downloadFile} = useContext(UserContext);
    let history = useHistory();
    const [code,setCode] = useState('Oldest');


    useEffect(()=>{
        if(!isLoggedIn){
            return history.push('/');
        }
    },[isLoggedIn,history]);


    useEffect(() => {
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
                //if the auth cookie expire then log the user out 
                if(err.response.data.error.toLowerCase().includes('please login')){
                    window.localStorage.setItem('isLoggedIn',false);
                    history.push("/user/login");
                    return;
                }
            }
        }
        getFiles();
    }, [history]);

    useEffect(()=>{
       setSearchRes(files);
    },[files]);
    
    const searchpdf = (val)=>{
        console.log(val);
       let results = !val ? files : files.filter((file)=> { return file.filename.toLowerCase().includes(val.toLocaleLowerCase());});
        setSearchRes(results);
    }

    const openFile = async (file) => {
         downloadFile(file);
      }

    const changeVal = useCallback((val)=>{
        setCode(val);
    },[]);

    return (
        <>
            <div className="container p-3">
                <div className="outer" style={{ marginBottom: '35px' }}>
                    <div className="mt-2">
                        {
                            files.length === 0 ?
                                <>
                                    <h4 className="text-center font-weight-light mt-2" style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>No PDF files yet :(</h4>
                                </>
                                :
                                <>
                                    <div className='files_search'>
                                        <Search searchpdf={searchpdf}/>
                                    </div>
                                     {
                                         searchRes.length===0 ? 
                                         <> 
                                    <h4 className="text-center font-weight-light my-5" style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>No such file found :(</h4>
                                       </>
                                        :
                                        <>
                                        <h4 className="xs:text-center md:text-left font-weight-light mt-4 md:mt-0" style={{color : `${Theme.textColor}`,fontFamily:`${fontStyle}` }}>Explore new files! - [{searchRes.length}]</h4>
                                        <Dropdown func={changeVal} name={code} />
                                        <div className='inner_files mt-3'>
                                        {
                                           [...searchRes].sort((a,b)=>{
                                            if(code === 'Oldest'){
                                              return a.dateUploded > b.dateUploded ? 1 : -1
                                            }else if(code === 'Newest'){
                                              return a.dateUploded > b.dateUploded ? -1 : 1
                                            }else if(code === 'A-Z'){
                                              return a.filename > b.filename ? 1 : -1
                                            }else{
                                              return a.filename > b.filename ? -1 : 1
                                            }
                                           }
                                           ).map((file, index) => {
                                               return <div key={index}>
                                                   <File file={file} func={openFile} text={"Download"} />
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