import React, { useState, useEffect } from 'react';
import LoginContext from '../contexts/login';
import initFirebase from '../../utils/auth/initFirebase';
import firebase from 'firebase/app';
import 'firebase/auth';

const LoginProvider = ({ children }) => {
  const [login, setLogin] = useState({
    user: null,
    isLoggingIn: true,
    setIsLoggingIn: (isUserLoggingIn) => {
      setLogin({...login, isLoggingIn: Boolean(isUserLoggingIn)})
    },
  });
  initFirebase();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((authUser) => {
      let userObj = authUser ? authUser : null;
      setLogin({
        ...login,
        user: userObj,
        isLoggingIn: false,
      })
    })
  }, [login.user]);

  return (
    <LoginContext.Provider value={login}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
