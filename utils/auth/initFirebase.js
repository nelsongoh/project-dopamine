import firebase from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyCDc6ZmvPUeFxMQqG_HvJfbgfkC_c_9-Vs",
  authDomain: "proj-dopamine.firebaseapp.com",
  projectId: "proj-dopamine",
};

const initFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
};

export default initFirebase;
