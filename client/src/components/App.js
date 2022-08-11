import React,{useContext,useEffect} from 'react';
import Navbar from './Navbar';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Footer from './Footer';
import Upload from './Upload';
import Files from '../pages/Files';
import Modal from './Modal';
import Profile from '../pages/Profile';
import { UserContext } from '../context/UserContext';


const App = () => {

    useEffect(()=>{
         console.log("App is mounted :)");
    },[]);

    const {Theme} = useContext(UserContext);
    return (
        <>
            <Navbar />
            <Switch>
                <>
                <div style={{ paddingTop: '75px',paddingBottom:'30px', backgroundColor: `${Theme.backgroundColor}`, minHeight: '100vh' }}>
                    <Route exact component={withRouter(Home)} path="/" />
                    <Route exact component={withRouter(Upload)} path="/upload" />
                    <Route exact component={withRouter(Files)} path="/files" />
                    <Route exact component={withRouter(Profile)} path="/profile" />
                    <Route exact component={withRouter(Register)} path="/user/register" />
                    <Route exact component={withRouter(Login)} path="/user/login" />
                </div>
                <Redirect to="/" />
                </>
            </Switch>
            <Modal />
            <Footer />
        </>
    );
}

export default App;
