import { useRef, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../css/Modal.css";

const Modal = () => {
    const { Theme, setDarkThemeStatus, fontStyle, setTheFontStyle } = useContext(ThemeContext);
    const modalRef = useRef(null);
    const checkRef = useRef(null);

    useEffect(() => {
        if (Theme.theme === 'dark') {
            checkRef.current.checked = true;
        }
    }, []);

    const toggle = () => {
        modalRef.current.classList.toggle('activeDiv');
    }

    const changeTheme = () => {
        if (Theme.theme === 'light')
            setDarkThemeStatus(true);
        else
            setDarkThemeStatus(false);
    }

    const changeStyle = (e)=>{
        setTheFontStyle(e.target.value);
    }

    return (
        <>
            <div className="modal_menubtn" onClick={toggle}>
                <FontAwesomeIcon icon={faGear} title="Settings" size="lg" color={`${Theme.primaryColor}`} />
            </div>
            <div className="modal_menu" ref={modalRef} style={{ backgroundColor: '#121212d9', boxShadow: `2px 5px 5px ${Theme.primaryColor}` }}>
                <div className="text-light mt-2">Theme</div>
                <div className="toggle">
                    <h5 className="tog" style={{ color: 'white'}}>Light</h5>
                    <input type="checkbox" id="switch" onChange={changeTheme} ref={checkRef} /><label htmlFor="switch">Toggle</label>
                    <h5 className="tog" style={{ color: 'white'}}>Dark</h5>
                </div>
                <div className="modal_closebtn" onClick={toggle}>
                    <FontAwesomeIcon icon={faXmark} title="Close" size="lg" color='white' />
                </div>
                <div className="text-light my-2">Fonts</div>
                <div className="d-flex flex-column align-items-start">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="fontSelector" id="fs1" value="'Comfortaa', cursive" onChange={changeStyle} checked={fontStyle.includes('Comfortaa') ? true : false} />
                        <div style={{ color: 'white', fontFamily:"'Comfortaa', cursive" }}>
                           Comfortaa
                        </div>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="fontSelector" id="fs2" value="'Itim', cursive" onChange={changeStyle} checked={fontStyle.includes('Itim') ? true : false} />
                        <div style={{ color: 'white',fontFamily:"'Itim', cursive" }}>
                            Itim
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal;