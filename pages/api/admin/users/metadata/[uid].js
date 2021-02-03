import verifyIsAdmin from '../../../../../lib/server/verifyIsAdmin';
import { retrieveMetadata } from '../../../../../lib/server/users/retrieveAll';

const handler = async (req, res) => {
  const {
    query: { uid },
  } = req;

  const isUserAdmin = await verifyIsAdmin(uid);

  if (isUserAdmin) {
    const { success, data, errorMsg } = await retrieveMetadata();

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