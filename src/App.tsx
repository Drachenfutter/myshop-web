import './App.css';
import NavBar from './components/naveBar';

import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import HomePage from './views/home';
import LoginPage from './views/login';
import NewUserPage from './views/newUser';
import React, { useEffect, useState } from 'react';
import { User } from './entity/user';
import { CONST } from './commons/labels';
import { isLogged } from './services/auth';
import ConfirmEmailSendPage from './views/confirmEmailSend';
import ConfirmEmailPage from './views/confirmEmailPage';

function App() {
  const [state, setState] = useState({
    user: {}
  });

  const setUser = (user: User)=>{
    localStorage.setItem(CONST.LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    setState({user: user});
  };

  const isLocalLogged = ():boolean =>{
    return Object.keys(state.user).length > 0 ? true : false;
  };

  useEffect(():void => {
    if(isLocalLogged()){
      return;
    }
    const localStorageUser = isLogged();
    if(localStorageUser){
      const localUser = localStorageUser as User;
      setUser(localUser);
    }
  });

  return (
    <div className="App">
      <NavBar userLogged={state.user}/>
      <BrowserRouter>
        <Switch>
          <Route path={CONST.PATH.HOME}>
            <HomePage />
          </Route>
          <Route path={CONST.PATH.SIGN_IN}>
            {isLocalLogged() ? <Redirect to="/home"/> : <LoginPage setUser={setUser} />}
          </Route>
          <Route path={CONST.PATH.SIGN_UP}>
          {isLocalLogged() ? <Redirect to="/home"/> : <NewUserPage setUser={setUser} />}
          </Route>
          <Route path={CONST.PATH.SEND_EMAIL}>
            <ConfirmEmailSendPage />
          </Route>
          <Route path={CONST.PATH.CONFIRM_EMAIL+'/:confirmationCode?'} >
            <ConfirmEmailPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
