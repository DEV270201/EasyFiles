import React, { useEffect, useState } from 'react';
import File from "./File";
import axios from "axios";
import Swal from 'sweetalert2';
import '../css/Files.css';
import Search from './Search';

const Files = () => {
    const [files, setFiles] = useState([]);
    const [searchRes,setSearchRes] = useState("");

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
            <div className="container p-3 overflow-y-scroll">
                <div className="outer" style={{ marginBottom: '35px' }}>
                    <div className="mt-2">
                        {
                            files.length === 0 ?
                                <>
                                    <h4 className="text-center font-weight-light mt-2">No PDF files yet :(</h4>
                                </>
                                :
                                <>
                                    <div className='files_search'>
                                        <Search searchpdf={searchpdf}/>
                                    </div>
                                     {
                                         searchRes.length===0 ? 
                                         <> 
                                    <h4 className="text-center font-weight-light my-5">No such file found :(</h4>
                                       </>
                                        :
                                        <>
                                        <h4 className="text-left font-weight-light my-2">Explore new PDF files!</h4>
                                        {
                                        searchRes.map((file, index) => {
                                            return <div key={index}>
                                                <File file={file} />
                                            </div>
                                        }) 
                                        }
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