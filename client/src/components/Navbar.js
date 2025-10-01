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
                <NavLink to="/" exact className="flex items-center hover:no-underline">
                <img src="/easyfiles_logo.png" className="h-12 w-12" />
                <span className="easyfiles_logo font-semibold text-lg">EasyFiles</span>
                </NavLink>
                <ul className={menu ? "list activeList" : "list"}>
                    {/* <li><NavLink onClick={() => setMenu(false)} className="nav_link" exact to="/" >Home</NavLink></li> */}
                    {
                        !isLoggedIn ?
                            <>
                                <li><NavLink onClick={() => setMenu(false)} className="nav_link" exact to="/" >Register</NavLink></li>
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
                            <div className="d-flex align-items-center p-1 border rounded-full" role="button" data-toggle="dropdown" aria-expanded="false" >
                                <ProfilePic image={profile.profile_pic} height="35px" width="35px" />
                            </div>
                            <div className="dropdown-menu bg-deepblack border-gray-400 text-gray-200 w-full">
                                <div className="w-full hover:cursor-pointer hover:bg-darkaccent">
                                    <NavLink onClick={() => setMenu(false)} to="/profile" className="px-2 hover:text-gray-200 w-full" style={{ textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faUser} />  Profile
                                    </NavLink>
                                </div>
                                <div onClick={logoutUser} className=" px-2 hover:cursor-pointer hover:bg-darkaccent w-full">
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
