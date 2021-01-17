import firebase from 'firebase/app';
import 'firebase/auth';
import initFirebase from '../../../utils/auth/initFirebase';
import { LoginErrors } from '../../models/login';

// Initialize the Firebase app
initFirebase();

export const signInUserEmailPwd = async (email, pwd) => {
  let signInOutcome = {
    error: LoginErrors(),
  }

  firebase.auth().signInWithEmailAndPassword(email, pwd)
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
