const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const handler = async (userToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(userToken);
    const uid = decodedToken.uid;

    if ((await admin.auth().getUser(uid)).customClaims.admin) {
      return true;
    } else {
      throw "Could not read the admin claim on the user.";
    }
  } catch (error) {
    console.log("Error encountered in verifyIsAdmin");
    console.log(error);
    return false;
  }
};

export default handler;
