import React from 'react';
import Navbar from './Navbar';
import { Switch,Route,Redirect,withRouter } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';

const App = ()=>{
   return(
    <>
    <Navbar />
    <Switch>
        <Route exact component={withRouter(Home)} path="/"  />
        <Route exact component={withRouter(Register)} path="/user/register"/>
        <Route exact component={withRouter(Login)} path="/user/login"/>
        <Redirect to="/" />
    </Switch>
    </>
   );
}

export default App;
