import React,{useState} from "react";
import '../css/Search.css';

const Search = ({searchpdf})=>{

  const[show,setShow] = useState(false);

  const searchPDF = (event)=>{
    searchpdf(event.target.value);
  }

  const changeVisibility = ()=>{
    setShow(!show);
  }

   return(
    <>
      <div className="search_outer">
         <input type="text" placeholder="Search PDF..."  className={`search_input ${show ? 'search_animate' : ''}`} onChange={searchPDF}/>
         <div className="search_btn" onClick={changeVisibility}>{show ? 'X' : 'S'}</div>
      </div>
    </>
   )
}

export default Search;