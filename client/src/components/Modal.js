import React, { useRef, useContext,useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear,faXmark } from "@fortawesome/free-solid-svg-icons";
import "../css/Modal.css";

const Modal = () => {
    const { Theme, setDarkThemeStatus } = useContext(UserContext);
    const modalRef = useRef(null);
    const checkRef = useRef(null);

    useEffect(()=>{
        console.log("modal :)");
      });

    useEffect(()=>{
       if(Theme.theme === 'dark'){
          checkRef.current.checked = true;
       }
    },[]);

    const toggle = ()=>{
       modalRef.current.classList.toggle('activeDiv');
    }

    const changeTheme = ()=>{
        if(Theme.theme === 'light')
          setDarkThemeStatus(true);
        else
        setDarkThemeStatus(false);
    }

    return (
        <>
            <div className="modal_menubtn" onClick={toggle}>
                <FontAwesomeIcon icon={faGear} title="Settings" size="lg" color={`${Theme.primaryColor}`}/>
            </div>
            <div className="modal_menu" ref={modalRef} style={{backgroundColor: '#121212d9',boxShadow : `2px 5px 5px ${Theme.primaryColor}`}}>
                <div className="text-light mt-2">Theme</div>
                <div className="toggle">
                    <h5 className="tog" style={{color: 'white'}}>Light</h5>
                    <input type="checkbox" id="switch"  onChange={changeTheme} ref={checkRef}/><label htmlFor="switch">Toggle</label>
                    <h5 className="tog" style={{color: 'white'}}>Dark</h5>
                </div>
            <div className="modal_closebtn" onClick={toggle}>
                <FontAwesomeIcon icon={faXmark} title="Close" size="lg" color='white'/>
            </div>
            <div className="text-light mt-2">Fonts</div>

            </div>
        </>
    )
}

export default Modal;