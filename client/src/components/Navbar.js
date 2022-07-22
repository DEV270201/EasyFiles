import React, { useContext,useState } from "react";
import { NavLink } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import Swal from 'sweetalert2';
import axios from "axios";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf,faBars } from "@fortawesome/free-solid-svg-icons";

import '../css/Navbar.css';

const Navbar = () => {
    const { isLoggedIn,setLoginStatus } = useContext(LoginContext);
    const history = useHistory();
    // const location = useLocation();
    const [menu,setMenu] = useState(false);

    const logout = async () => {
        try {
            setMenu(false);
            let response = await axios.get("/user/logout");
            setLoginStatus(false);
            if (response.data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Yayy...',
                    text: response.data.msg
                });
                window.localStorage.setItem('isLoggedIn', false);
                history.push("/");
            }
        } catch (err) {
            console.log("logout err : ", err);
        }
    }

    console.log("navbar");
    return (
        <>
         <nav className="nav_bar">
                <div className="menu_logo" onClick={() => setMenu(!menu)}><FontAwesomeIcon icon={faBars} color="white" size="lg" /></div>
                <h5 className="nav_logo"><NavLink to="/" exact><FontAwesomeIcon size="lg" className="pdf" icon={faFilePdf} />yourMinePDF</NavLink></h5>
                <ul className={menu ? "list active" : "list"}>
                    <li><NavLink onClick={()=> setMenu(false)} className="nav_link" exact to="/" >Home</NavLink></li>
                    {
                        !isLoggedIn ? 
                        <>
                         <li><NavLink onClick={()=> setMenu(false)} className="nav_link" to="/user/register" >Register</NavLink></li>
                        <li><NavLink onClick={()=> setMenu(false)} className="nav_link" to="/user/login" >Login</NavLink></li>
                        </>
                        :
                        <>
                        <li><NavLink onClick={()=> setMenu(false)} className="nav_link" to="/upload" >Upload</NavLink></li>
                        <li><NavLink onClick={()=> setMenu(false)} className="nav_link" to="/files" >Files</NavLink></li>
                        <li><div onClick={logout} className="nav_link logout">Logout</div></li>
                        </>
                    }
                </ul>
            </nav>
        </>
    );
}

export default Navbar;

{/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark mynavbar">
    <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">yourMinePDF</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto mb-2 mb-lg-0 list">
                <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                </li>
                {
                    !isLoggedIn ?
                        <>
                            <li className={`nav-item ${location.pathname === '/user/register' ? 'active' : ''}`}>
                                <NavLink className="nav-link" to="/user/register">Register</NavLink>
                            </li>
                            <li className={`nav-item ${location.pathname === '/user/login' ? 'active' : ''}`}>
                                <NavLink className="nav-link" to="/user/login">Login</NavLink>
                            </li>
                        </>
                        :
                        <>
                            <li className={`nav-item ${location.pathname === '/upload' ? 'active' : ''}`}>
                                <NavLink activeClassName="active" className="nav-link" aria-current="page" to="/upload" >Upload</NavLink>
                            </li>
                            <li className={`nav-item ${location.pathname === '/files' ? 'active' : ''}`}>
                                <NavLink activeClassName="active" className="nav-link" aria-current="page" to="/files" >Files</NavLink>
                            </li>
                            <li className="nav-item">
                                <div className="nav-link logout" onClick={logout}>Logout</div>
                            </li>
                        </>
                }
            </ul>
        </div>
    </div>
</nav> */}