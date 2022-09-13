import React,{useContext,useEffect} from "react";
import { UserContext } from "../context/UserContext";
import "../css/Navbar.css";

const Dropdown = ({func,name}) => {
    const {Theme} = useContext(UserContext);
  
    const hello = (e)=>{
          func(e.target.innerText);
    }

    useEffect(()=>{
      console.log("dropdownnnn");
    },[]);

    return (
        <>
            <div className="dropdown">
                <button className={`dropdown-toggle btn ${Theme.theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'}`} id="dropdownMenuLink" data-toggle="dropdown" aria-expanded="false">
                    Sort
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                 <li className="drop_list" onClick={hello} style={{backgroundColor:`${name === 'Oldest' ? "#c5c6d0" : "#fff"}`}} >Oldest</li>
                 <li className="drop_list" onClick={hello} style={{backgroundColor:`${name === 'Newest' ? "#c5c6d0" : "#fff"}`}}>Newest</li>
                 <li className="drop_list" onClick={hello} style={{backgroundColor:`${name === 'A-Z' ? "#c5c6d0" : "#fff"}`}}>A-Z</li>
                 <li className="drop_list" onClick={hello} style={{backgroundColor:`${name === 'Z-A' ? "#c5c6d0" : "#fff"}`}}>Z-A</li>
                </ul>
            </div>
        </>
    );
}

export default React.memo(Dropdown);