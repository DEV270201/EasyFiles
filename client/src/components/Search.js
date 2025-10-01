import {useState,useContext,useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass,faXmark } from '@fortawesome/free-solid-svg-icons'
import { ThemeContext } from "../context/ThemeContext";

const Search = ({searchpdf})=>{

  const searchPDF = (event)=>{
    searchpdf(event.target.value);
  }

   return(
    <>
      <div className="w-full flex items-center my-4 relative">
         <input type="text" placeholder="Search Files By Name..."  className={` pl-10 py-2 bg-deepblack flex-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-limegreen`} onChange={searchPDF}/>
         <div className="absolute px-3">
         <FontAwesomeIcon icon={faMagnifyingGlass} title="Search" color={`#edf2f7`}/>
         </div>
      </div>
    </>
   )
}

export default Search;