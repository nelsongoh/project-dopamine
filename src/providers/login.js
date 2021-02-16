import React, { useEffect, useState } from 'react';
import LoginContext from '../contexts/login';
import { initFirebase } from '../firebase';
import firebase from 'firebase/app';
import 'firebase/auth';

const LoginProvider = ({ children }) => {
  initFirebase();
  const [login, setLogin] = useState({
    userToken: null,
    isLoggingIn: true,
    isAdmin: false,
    setIsLoggingIn: (isUserLoggingIn) => {
      setLogin({...login, isLoggingIn: Boolean(isUserLoggingIn)})
    },
  });
  
  useEffect(() => {
    firebase.auth().onIdTokenChanged(async (authUser) => {
      if (authUser) {
        let isUserAdmin = false;
        let theUserToken = null;

        // Check to see if the user is an admin
        try {
          isUserAdmin = !!(await authUser.getIdTokenResult()).claims.admin;
          theUserToken = await authUser.getIdToken();
        } catch (error) {
          console.log(`There was an error with checking the user's admin status, or with retrieving the user's ID token.`);
          console.log(error);
        } finally {
          setLogin({
            ...login,
            userToken: theUserToken,
            isAdmin: isUserAdmin,
            isLoggingIn: false,
          });
        }
      } else {
        setLogin({
          ...login,
          userToken: null,
          isAdmin: false,
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
