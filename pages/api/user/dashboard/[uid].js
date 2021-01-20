const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const handler = async (req, res) => {
  const {
    query: { uid },
  } = req;

  // Attempt to retrieve the data
  const db = admin.firestore();
  const userViewsRef = db.collection('users').doc(uid);
  const doc = await userViewsRef.get();

  if (doc.exists) {
    console.log(doc.data());
  }
  
  res.status(200).json(doc.data());
};

export default handler;
