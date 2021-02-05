const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const handler = async (req, res) => {
  const {
    query: { userToken },
  } = req;

  // Verify the user's token
  try {
    const claims = await admin.auth().verifyIdToken(userToken);
    // Attempt to retrieve the data
    const db = admin.firestore();
    const userViewsRef = db.collection('users').doc(claims.uid);
    const doc = await userViewsRef.get();

    if (doc.exists) {
      res.status(200).json(doc.data());
    } else {
      res.status(400).json({});
    }
  } catch (error) {
    // Throw an error if we cannot verify the user's ID token
    res.status(401).json({});
  }  
};

export default handler;
