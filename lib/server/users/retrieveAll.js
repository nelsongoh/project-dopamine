import { 
  RetrieveAllUsersOutcome, UserAuthRecord,
} from '../../../src/models/admin/users';

import { isNumeric } from '../users/utils';

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export const retrieveUserAuthData = async (nextPageToken, numUsers = 100) => {
  let outcome = RetrieveAllUsersOutcome();
  let maxResults = ((Number(numUsers) > 100) || (Number(numUsers) <= 0) || (!isNumeric(numUsers))) ? 100 : Number(numUsers);
  try {
    const listUsersResult = await admin.auth().listUsers(
      maxResults,
      nextPageToken
    );
    listUsersResult.users.forEach((userRecord) => {
      // We write the details we have into the outcome list
      let user = UserAuthRecord();
      user.email = userRecord.email;
      user.uid = userRecord.uid;
      user.isAccEnabled = !userRecord.disabled;
      outcome.data.users.push(user);
    });

    // If there is a next page token, we return it to the user
    if (listUsersResult.pageToken) {
      outcome.data.nextPageToken = listUsersResult.pageToken;
    }

    outcome.success = true;
  } catch (error) {
    console.log(error);
    outcome.success = false;
    outcome.errorMsg = `Something has gone wrong with retrieving the list of users:\n${error}`;
  } finally {
    return outcome;
  }
};
