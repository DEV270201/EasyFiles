import React, { useEffect, useState } from 'react';
import File from "./File";
import axios from "axios";
import Swal from 'sweetalert2';

const Files = () => {
    const [files, setFiles] = useState([]);

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
                                    <h4 className="text-center font-weight-light my-2">Explore new PDF files!</h4>
                                    {
                                        files.map((file, index) => {
                                            return <div key={index}>
                                                <File file={file} />
                                            </div>
                                        })
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