import firebase from 'firebase/app';
import 'firebase/auth';
import initFirebase from '../../../utils/auth/initFirebase';
import { LoginErrors } from '../../models/login';
import { PwdChangeErrors } from '../../models/profile';
import { ReAuthErrors } from '../../models/reauth';

// Initialize the Firebase app
initFirebase();

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
