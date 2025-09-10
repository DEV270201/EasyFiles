import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faBars, faUser, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import '../css/Navbar.css';
import ProfilePic from './ProfilePic';


const Navbar = () => {
    const { isLoggedIn,profile,logout } = useContext(UserContext);
    const [menu, setMenu] = useState(false);

    const logoutUser = async () => {
        setMenu(false);
        logout();
    }

    return (
        <>
            <nav className="nav_bar">
                <div className="menu_logo" onClick={() => setMenu(!menu)}><FontAwesomeIcon icon={faBars} color="white" size="lg" /></div>
                <h5 className="nav_logo"><NavLink to="/" exact><FontAwesomeIcon size="lg" className="pdf" icon={faFilePdf} />EasyFiles</NavLink></h5>
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
                {
                    isLoggedIn ?
                        <div className="dropdown mx-2">
                            <div className="d-flex align-items-center p-1" role="button" data-toggle="dropdown" aria-expanded="false" style={{boxShadow: `1px 1px 4px #555555`}} >
                                <ProfilePic image={profile.profile_pic} height="35px" width="35px" />
                            </div>
                            <div className="dropdown-menu">
                                <div className="drop_list">
                                    <NavLink onClick={() => setMenu(false)} to="/profile" className="text-dark" style={{ textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faUser} />  Profile
                                    </NavLink>
                                </div>
                                <div onClick={logoutUser} className="drop_list text-dark">
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} />  Logout
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
            </nav>
        </>
    );
}

export default Navbar;
