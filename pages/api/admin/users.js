import verifyIsAdmin from '../../../lib/server/verifyIsAdmin';
import createUser from '../../../lib/server/users/create';
import updateUser from '../../../lib/server/users/update';

const handler = async (req, res) => {
  const {
    query: { userToken },
    method,
    body,
  } = req;

  if (userToken || body.data.userToken) {
    const isUserAdmin = await verifyIsAdmin(userToken || body.data.userToken);

    if (isUserAdmin) {
      switch (method) {
        case "POST": {
          const outcome = await createUser(body.data);
          if (outcome.success) {
            res.status(204).json({});
          } else {
            res.status(400).json(outcome.errors);
          }
          break;
        }

        case "PATCH": {
          const outcome = await updateUser(body.data);
          if (outcome.success) {
            res.status(204).json({});
          } else {
            console.log(outcome.errors);
            res.status(400).json(outcome.errors)
          }
          break;
        }

        default:
          res.status(404).json({});
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
