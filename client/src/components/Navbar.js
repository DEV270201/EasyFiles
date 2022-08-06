import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Swal from 'sweetalert2';
import axios from "axios";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faBars, faUser, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import '../css/Navbar.css';
import ProfilePic from './ProfilePic';

const Navbar = () => {
    const { isLoggedIn, setLoginStatus, profile } = useContext(UserContext);
    const history = useHistory();
    // const location = useLocation();
    const [menu, setMenu] = useState(false);

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
                <ul className={menu ? "list activeList" : "list"}>
                    <li><NavLink onClick={() => setMenu(false)} className="nav_link" exact to="/" >Home</NavLink></li>
                    {
                        !isLoggedIn ?
                            <>
                                <li><NavLink onClick={() => setMenu(false)} className="nav_link" to="/user/register" >Register</NavLink></li>
                                <li><NavLink onClick={() => setMenu(false)} className="nav_link" to="/user/login" >Login</NavLink></li>
                            </>
                            :
                            <>
                                <li><NavLink onClick={() => setMenu(false)} className="nav_link" to="/upload" >Upload</NavLink></li>
                                <li><NavLink onClick={() => setMenu(false)} className="nav_link" to="/files" >Files</NavLink></li>
                            </>
                    }
                </ul>
                <div className="dropdown mx-2">
                    <div className="dropdown-toggle d-flex align-items-center" role="button" data-toggle="dropdown" aria-expanded="false">
                        <ProfilePic image={profile.profile_pic} height="35px" width="35px" />
                    </div>
                    <div className="dropdown-menu">
                        <div className="drop_list">
                            <NavLink onClick={() => setMenu(false)} to="/profile" className="text-dark" style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faUser} />  Profile
                            </NavLink>
                        </div>
                        <div onClick={logout} className="drop_list">
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />  Logout
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
