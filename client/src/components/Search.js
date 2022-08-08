import React,{useState,useContext,useRef,useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass,faXmark } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from "../context/UserContext";
import '../css/Search.css';

const Search = ({searchpdf})=>{

  const[show,setShow] = useState(false);
  const {Theme} = useContext(UserContext);
  const btnRef = useRef(null);

  const searchPDF = (event)=>{
    searchpdf(event.target.value);
  }

  const changeVisibility = ()=>{
    setShow(!show);
  }

  useEffect(()=>{
    console.log("search :)");
  });

   return(
    <>
      <div className="search_outer">
         <input type="text" placeholder="Search PDF..."  className={`search_input myform form-control ${show ? 'search_animate' : ''}`} onChange={searchPDF}/>
         <div className="search_btn" onClick={changeVisibility} ref={btnRef} style={{backgroundColor : `${Theme.backgroundColor}`,border: `1px solid ${Theme.primaryColor}`}}>
          {
          !show ?
          <>
          <FontAwesomeIcon icon={faMagnifyingGlass} title="Search" color={`${Theme.primaryColor}`}/>
          </>
          :
          <>
          <FontAwesomeIcon icon={faXmark} title="Hide" color={`${Theme.primaryColor}`}/>
          </>
          }
        </div>
      </div>
    </>
   )
}

export default Search;