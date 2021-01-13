import firebase from 'firebase/app';
import 'firebase/auth';
import initFirebase from '../../../utils/auth/initFirebase';

// Initialize the Firebase app
initFirebase();

const signInUserEmailPwd = async (email, pwd) => {
  let signInOutcome = {
    login: true,
    error: null,
  }

  await firebase.auth().signInWithEmailAndPassword(email, pwd)
    .catch((error) => {
      switch (error.code) {
        case 'auth/invalid-email':
          signInOutcome.login = false;
          signInOutcome.error = {
            email: "Invalid email address."
          }
          break;

        case 'auth/user-disabled':
          signInOutcome.login = false;
          signInOutcome.error = {
            email: "This account has been disabled. Please contact an administrator."
          }
          break;

        case 'auth/user-not-found':
          signInOutcome.login = false;
          signInOutcome.error = {
            email: "This user does not exist."
          }
          break;

        case 'auth/wrong-password':
          signInOutcome.login = false;
          signInOutcome.error = {
            pwd: "Invalid password."
          }
          break;

        default:
          signInOutcome.login = false;
          signInOutcome.error = {
            email: "Something has gone wrong with the sign-in process. Please try again later."
          }
          break;
      }
    });

  return signInOutcome;
}

export default signInUserEmailPwd;
