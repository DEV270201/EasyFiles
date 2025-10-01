import {useContext} from 'react';
import Navbar from './Navbar';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Footer from './Footer';
import Upload from '../pages/Upload';
import Files from '../pages/Files';
import Profile from '../pages/Profile';
import OthersProfile from '../pages/OthersProfile';
import { ThemeContext } from '../context/ThemeContext';


const App = () => {

    const {Theme} = useContext(ThemeContext);
    return (
        <>
            <Navbar />
            <Switch>
                <>
                <main className='min-h-screen w-full flex pt-[75px]'>
                    {/* <Route exact component={withRouter(Home)} path="/" /> */}
                    <Route exact component={withRouter(Register)} path="/" />
                    <Route exact component={withRouter(Upload)} path="/upload" />
                    <Route exact component={withRouter(Files)} path="/files" />
                    <Route exact component={withRouter(Profile)} path="/profile" />
                    <Route exact component={withRouter(Login)} path="/user/login" />
                    <Route exact component={withRouter(OthersProfile)} path="/profile/:user" />
                </main>
                <Redirect to="/" />
                </>
            </Switch>
            {/* <Footer /> */}
        </>
    );
}

export default App;
