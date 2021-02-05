import React, { useState, useEffect } from 'react';
import LoginContext from '../contexts/login';
import initFirebase from '../../utils/auth/initFirebase';
import firebase from 'firebase/app';
import 'firebase/auth';

const LoginProvider = ({ children }) => {
  const [login, setLogin] = useState({
    userToken: null,
    isLoggingIn: true,
    setIsLoggingIn: (isUserLoggingIn) => {
      setLogin({...login, isLoggingIn: Boolean(isUserLoggingIn)})
    },
  });
  initFirebase();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        authUser.getIdToken()
          .then((userObjToken) => {
            setLogin({
              ...login,
              userToken: userObjToken,
              isLoggingIn: false,
            });
          })
          .catch((error) => {
            setLogin({
              ...login,
              userToken: null,
              isLoggingIn: false,
            });
          });
      } else {
        setLogin({
          ...login,
          userToken: null,
          isLoggingIn: false,
        });
      }
    })
  }, [login.userToken]);

  return (
    <LoginContext.Provider value={login}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
