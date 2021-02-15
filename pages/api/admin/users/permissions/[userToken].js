import verifyIsAdmin from '../../../../../lib/server/verifyIsAdmin';

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

  const isUserAdmin = await verifyIsAdmin(userToken);

  if (isUserAdmin) {
    const db = admin.firestore();
    const defRef = db.collection("definitions").doc("permissions");
    const defDoc = await defRef.get();

    if (defDoc.exists) {
      const returnedData = defDoc.data();
      res.status(200).json(returnedData);
    } else {
      res.status(404).json({});
    }
  } else {
    res.status(401).json({});
  }
};

export default handler;
