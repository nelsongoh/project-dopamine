import verifyIsAdmin from '../../../../../lib/server/verifyIsAdmin';

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

  const isUserAdmin = await verifyIsAdmin(uid);

  if (isUserAdmin) {
    const db = admin.firestore();
    const permsRef = db.collection('permissions').doc('pages');
    const permsDoc = await permsRef.get();

    if (permsDoc.exists) {
      const returnedData = permsDoc.data();
      res.status(200).json(returnedData);
    } else {
      res.status(404).json({});
    }
  } else {
    res.status(401).json({});
  }
};

export default handler;
