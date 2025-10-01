import React,{useContext} from "react";
import { ThemeContext } from "../context/ThemeContext";

const FileActionsDropdown = ({func,name}) => {
    const {Theme} = useContext(ThemeContext);
  
    const performAction = ()=>{
          func();
    }

    return (
        <>
            <div className="w-32">
                <button className={`dropdown-toggle outline-none w-full btn bg-deepblack border-limegreen text-limegreen hover:bg-limegreen hover:text-black`} id="dropdownMenuLink" data-toggle="dropdown" aria-expanded="false">
                    Actions
                </button>
                <ul className="dropdown-menu bg-deepblack border text-gray-200" aria-labelledby="dropdownMenuLink">
                 <li className={`mx-1 p-1 font-bold hover:cursor-pointer hover:bg-darkaccent`} onClick={performAction}>Download</li>
                 <li className={`mx-1 p-1 font-bold hover:cursor-pointer hover:bg-darkaccent`} onClick={performAction}>Preview</li>
                 <li className={`mx-1 p-1 font-bold hover:cursor-pointer hover:bg-darkaccent`} onClick={performAction}>Change Status</li>
                 <li className={`mx-1 p-1 font-bold hover:cursor-pointer hover:bg-darkaccent`} onClick={performAction}>Delete</li>
                </ul>
            </div>
        </>
    );
}

export default React.memo(FileActionsDropdown);