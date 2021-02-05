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

  try {
    const claims = await admin.auth().verifyIdToken(userToken);
    // Attempt to retrieve the data
    const db = admin.firestore();
    const userViewsRef = db.collection('calendar').doc(claims.uid);
    const doc = await userViewsRef.get();

    if (doc.exists) {
      let returnedData = doc.data();
      returnedData['overlays']['fortuneTelling']['idxZeroRefDate'] = doc.data()['overlays']['fortuneTelling']['idxZeroRefDate'].toDate();
      res.status(200).json(returnedData);
    } else {
      res.status(400).json({});
    }
  } catch (error) {
    res.status(401).json({});
  }
};

export default handler;
