const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const handler = async (uid) => {
  const db = admin.firestore();
  const userViewsRef = db.collection('users').doc(uid);
  const userDoc = await userViewsRef.get();

  if (userDoc.exists) {
    const returnedData = userDoc.data();
    const reqUserPerms = returnedData['dashboard']['views'];

    let isUserAuth = false;

    for (let i = 0; i < reqUserPerms.length; i += 1) {
      if (reqUserPerms[i] === 1337) {
        isUserAuth = true;
        break;
      }
    }

    if (isUserAuth) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default handler;
