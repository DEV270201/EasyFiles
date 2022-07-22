import React from "react";
import '../css/Search.css';

const Search = ({searchpdf})=>{

  const searchPDF = (event)=>{
    searchpdf(event.target.value);
  }

   return(
    <>
      <div className="search_outer">
         <input type="text" placeholder="Search PDF..."  className="search_input" onChange={searchPDF}/>
         <div className="search_btn">S</div>
      </div>
    </>
   )
}

export default Search;