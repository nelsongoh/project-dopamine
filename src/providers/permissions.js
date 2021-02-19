import { useContext, useEffect, useState } from 'react';
import PermissionsContext from '@/contexts/permissions';
import LoginContext from '@/contexts/login';
import { initFirebase } from '../firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const PermissionsProvider = ({ children }) => {
  initFirebase();
  const { userToken, isAdmin } = useContext(LoginContext);

  const fetchPermissions = async () => {
    let permsList = null;

    if (userToken !== null) {
      try {
        // Fetch the user's permissions first
        const userRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) { 
          const userPermsData = userDoc.data().permissions;
          
          let pagesRef;

          // If the user has a general permission class, retrieve pages belonging to the class
          if (userPermsData.permissionClass !== null) {
            // If the user is an admin, retrieve all pages
            if (isAdmin) {
              pagesRef = firebase.firestore().collection("pages");
            } else {
              // Otherwise only retrieve the pages which belong to this general class
              pagesRef = firebase.firestore().collection("pages").where("type", "==", userPermsData.permissionClass);
            }
          } else {
            // Otherwise, only retrieve the specific pages granted to them
            pagesRef = firebase.firestore().collection("pages").where("typeCode", "in", userPermsData.pages);
          }

          const pagesDocSnapshot = await pagesRef.get();
          permsList = [];
          pagesDocSnapshot.forEach((doc) => {
            permsList.push(doc.data());
          });

          // Sort the permissions list by title, in alphabetically ascending order
          if (permsList.length > 0) {
            permsList = permsList.sort((a,b) => {
              if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return 1;
              }

              if (a.title.toLowerCase() < b.title.toLowerCase()) {
                return -1;
              }

              return 0;
            })
          }
        } else {
          throw "No such user found. Could not retrieve permissions list for user."
        }
      } catch (error) {
        console.log(`An error occurred while trying to fetch the user's permissions.`);
        console.log(error);
      } finally {
        return permsList;
      }
    }
    
    return permsList;
  };

  const refreshPermissions = async () => {
    // Retrieve list of permissions, and authorized page links
    const permsList = await fetchPermissions();
    // // Update state of permissions
    setPerms(permsList);
  };

  const checkPermissions = (permToCheck) => {
    if (permissions !== null && permissions.length > 0) {
      for (let i = 0; i < permissions.length; i += 1) {
        if (permissions[i].typeCode === permToCheck) {
          return true;
        }
      }
    }
    
    return false;
  };

  const [permissions, setPerms] = useState(null);

  useEffect(() => {
    // Retrieve the list of user permissions
    refreshPermissions();
  }, [userToken]);

  return (
    <PermissionsContext.Provider value={{ permissions, refreshPermissions, checkPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsProvider;
