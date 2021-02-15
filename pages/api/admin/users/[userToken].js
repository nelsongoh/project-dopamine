import verifyIsAdmin from '../../../../lib/server/verifyIsAdmin';
import { retrieveUserAuthData } from '../../../../lib/server/users/retrieveAll';

const handler = async (req, res) => {
  const {
    query: { userToken, npt, userLimit },
  } = req;

  const isUserAdmin = await verifyIsAdmin(userToken);

  if (isUserAdmin) {
    const { success, data, errorMsg } = await retrieveUserAuthData(npt, userLimit);

    if (success) {
      res.status(200).json(data);
    } else {
      res.status(400).json(errorMsg);
    }
  } else {
    res.status(401).json({});
  }
};

export default handler;