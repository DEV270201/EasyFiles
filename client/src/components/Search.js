import {useState,useContext,useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass,faXmark } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from "../context/UserContext";

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

   return(
    <>
      <div className="search_outer">
         <input type="text" disabled={!show} placeholder="Search PDF..."  className={`search_input myform ${show ? 'search_animate' : ''}`} onChange={searchPDF}/>
         <button className="search_btn" onClick={changeVisibility} ref={btnRef} style={{backgroundColor : `${Theme.backgroundColor}`,border: `1px solid ${Theme.primaryColor}`}}>
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
        </button>
      </div>
    </>
   )
}

export default Search;