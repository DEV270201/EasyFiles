import React from 'react';
import Navbar from './Navbar';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Footer from './Footer';
import LoginContextProvider from '../context/LoginContext';
import Upload from './Upload';
import Files from './Files';

const App = () => {
    return (
        <>
            <LoginContextProvider>
                <Navbar />
                <Switch>
                    <div style={{paddingTop : '75px'}}>
                    <Route exact component={withRouter(Home)} path="/" />
                    <Route exact component={withRouter(Upload)} path="/upload" />
                    <Route exact component={withRouter(Files)} path="/files" />
                    <Route exact component={withRouter(Register)} path="/user/register" />
                    <Route exact component={withRouter(Login)} path="/user/login" />
                    </div>
                    <Redirect to="/" />
                </Switch>
            </LoginContextProvider>
            <Footer />
        </>
    );
}

export default App;
