import React, { useRef, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear,faXmark } from "@fortawesome/free-solid-svg-icons";
import "../css/Modal.css";

const Modal = () => {
    const { Theme, setDarkThemeStatus } = useContext(UserContext);
    const modalRef = useRef(null);

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
                <FontAwesomeIcon icon={faGear} title="Settings" size="lg" color={`${Theme.textColor}`}/>
            </div>
            <div className="modal_menu" ref={modalRef} style={{backgroundColor: `${Theme.surfaceColor}`}}>
                <div className="toggle">
                    <h5 className="tog" style={{color: `${Theme.textColor}`}}>Light</h5>
                    <input type="checkbox" id="switch"  onChange={changeTheme}/><label htmlFor="switch">Toggle</label>
                    <h5 className="tog" style={{color: `${Theme.textColor}`}}>Dark</h5>
                </div>
            <div className="modal_closebtn" onClick={toggle}>
                <FontAwesomeIcon icon={faXmark} title="Close" size="lg" color={`${Theme.textColor}`}/>
            </div>
            </div>
        </>
    )
}

export default Modal;