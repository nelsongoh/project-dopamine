import firebase from 'firebase/app';

const config = {
  apiKey: "AIzaSyCDc6ZmvPUeFxMQqG_HvJfbgfkC_c_9-Vs",
  authDomain: "proj-dopamine.firebaseapp.com",
  projectId: "proj-dopamine",
};

export const initFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
};
