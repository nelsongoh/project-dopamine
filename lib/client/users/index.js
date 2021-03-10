import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { LoginErrors } from '../../../src/models/login';
import { PwdChangeErrors } from '../../../src/models/profile';
import { ReAuthErrors } from '../../../src/models/reauth';
import { RetrieveMetadataOutcome } from '../../../src/models/admin/users';

export const fetchUserMetadata = async () => {
  let outcome = RetrieveMetadataOutcome();
  try {
    const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();

    if (!!idTokenResult.claims.admin) {
      const db = firebase.firestore();
      const metaRef = db.collection("metadata").doc("users");
      const metaUsersDoc = await metaRef.get();

      if (metaUsersDoc.exists) {
        outcome.success = true;
        outcome.data = metaUsersDoc.data();
      } else {
        throw "Could not find the user metadata document.";
      }
    } else {
      throw "No authorization allowed for this action.";
    }
  } catch (error) {
    console.log("Something has gone wrong with fetching the user metadata:");
    console.log(error);
    outcome.errorMsg = error;
  } finally {
    return outcome;
  }
};

export const fetchUserInfo = () => {
  let userInfo = {
    name: "The user's name could not be retrieved.",
    email: "The user's email could not be retrieved.",
  };

  if (firebase.auth().currentUser !== null) {
    if (firebase.auth().currentUser.displayName) {
      userInfo.name = firebase.auth().currentUser.displayName;
    }

    if (firebase.auth().currentUser.email) {
      userInfo.email = firebase.auth().currentUser.email;
    }
  }

  return userInfo;
};

export const signInUserEmailPwd = async (email, pwd) => {
  let signInOutcome = {
    error: LoginErrors(),
  };

  await firebase.auth().signInWithEmailAndPassword(email, pwd)
    .catch((error) => {
      switch (error.code) {
        case 'auth/invalid-email':
          signInOutcome.error.email.hasError = true;
          signInOutcome.error.email.msg = "Invalid email address.";
          break;

        case 'auth/user-disabled':
          signInOutcome.error.email.hasError = true;
          signInOutcome.error.email.msg = "This account has been disabled. Please contact an administrator.";
          break;

        case 'auth/user-not-found':
          signInOutcome.error.email.hasError = true;
          signInOutcome.error.email.msg = "This user does not exist.";
          break;

        case 'auth/wrong-password':
          signInOutcome.error.pwd.hasError = true;
          signInOutcome.error.pwd.msg = "Invalid password.";
          break;

        default:
          console.log(error);
          signInOutcome.error.email.hasError = true;
          signInOutcome.error.email.msg = "Something has gone wrong with the sign-in process. Please try again later.";
          break;
      }
    });

  return signInOutcome;
}

export const signOutUser = () => {
  firebase.auth().signOut();
};

export const changeUserPwd = async (newPwd) => {
  let chngPwdOutcome = {
    error: PwdChangeErrors(),
  };

  // If the user is not logged in, don't do anything
  if (firebase.auth().currentUser === null) {
    chngPwdOutcome.error.reqReLogin = true;
    return chngPwdOutcome;
  }

  await firebase.auth().currentUser.updatePassword(newPwd)
    .catch((error) => {
      switch (error.code) {
        case 'auth/weak-password':
          chngPwdOutcome.error.isPwdWeak = true;
          break;

        case 'auth/requires-recent-login':
          chngPwdOutcome.error.reqReLogin = true;
          break;

        default:
          chngPwdOutcome.error.others = true;
          break;
      }
    });

  return chngPwdOutcome;
};

export const getEmailAuthCred = (email, pwd) => {
  const cred = firebase.auth.EmailAuthProvider.credential(
    email,
    pwd,
  );

  return cred;
};

export const reAuthUser = async (userCred) => {
  let reAuthUserOutcome = {
    error: ReAuthErrors(),
  };

  await firebase.auth().currentUser.reauthenticateWithCredential(userCred)
    .catch((error) => {
      reAuthUserOutcome.error.hasError = true;

      switch (error.code) {
        case 'auth/user-mismatch':
          reAuthUserOutcome.error.errorMsg = "The user credential does not match the current user.";
          break;

        case 'auth/user-not-found':
          reAuthUserOutcome.error.errorMsg = "The user credential does not match any existing user.";
          break;

        case 'auth/invalid-credential':
          reAuthUserOutcome.error.errorMsg = "The user credential is invalid.";
          break;

        case 'auth/invalid-email':
          reAuthUserOutcome.error.errorMsg = "The email address used for reauthentication is invalid.";
          break;

        case 'auth/wrong-password':
          reAuthUserOutcome.error.errorMsg = "The password used for reauthentication is invalid.";
          break;

        case 'auth/invalid-verification-code':
          reAuthUserOutcome.error.errorMsg = "The verification code for the user credential is invalid.";
          break;

        case 'auth/invalid-verification-id':
          reAuthUserOutcome.error.errorMsg = "The verification ID for the user credential is not valid.";
          break;

        default:
          reAuthUserOutcome.error.errorMsg = "Something has gone wrong with the reauthentication process. Please try again later.";
          break;
      } 
    });

  return reAuthUserOutcome;
};
