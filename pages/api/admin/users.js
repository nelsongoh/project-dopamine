import verifyIsAdmin from '../../../lib/server/verifyIsAdmin';
import createUser from '../../../lib/server/users/create';

const handler = async (req, res) => {
  const {
    query: { uid },
    method,
    body,
  } = req;

  if (uid || body.data.uid) {
    const isUserAdmin = await verifyIsAdmin(uid || body.data.uid);

    if (isUserAdmin) {
      switch (method) {
        case "POST":
          const outcome = await createUser(body.data);
          if (outcome.success) {
            res.status(200).json({});
          } else {
            res.status(400).json(outcome.errors);
          }
          break;

        case "GET":
          res.status(200).json({});
          break;
      }
    } else {
      res.status(401).json({});
    }
  } else {
    res.status(400).json({});
  }
};

export default handler;
