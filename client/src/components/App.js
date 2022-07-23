import React,{useContext} from 'react';
import Navbar from './Navbar';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Footer from './Footer';
import Upload from './Upload';
import Files from './Files';
import Modal from './Modal';
import { UserContext } from '../context/UserContext';

const App = () => {

    const {Theme} = useContext(UserContext);
    return (
        <>
            <Navbar />
            <Switch>
                <div style={{ paddingTop: '75px', backgroundColor: `${Theme.backgroundColor}`, minHeight: '100vh' }}>
                    <Route exact component={withRouter(Home)} path="/" />
                    <Route exact component={withRouter(Upload)} path="/upload" />
                    <Route exact component={withRouter(Files)} path="/files" />
                    <Route exact component={withRouter(Register)} path="/user/register" />
                    <Route exact component={withRouter(Login)} path="/user/login" />
                </div>
                <Redirect to="/" />
            </Switch>
            <Modal />
            <Footer />
        </>
    );
}

export default App;
