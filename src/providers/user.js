import React, { useState, useEffect } from 'react';
import UserContext from '../contexts/user';
import initFirebase from '../../utils/auth/initFirebase';
import firebase from 'firebase/app';
import 'firebase/auth';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  initFirebase();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser)
      } else {
        setUser(null);
      }
    })
  }, [user]);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
