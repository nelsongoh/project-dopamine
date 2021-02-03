import { 
  RetrieveAllUsersOutcome, FullUser, RetrieveMetadataOutcome,
} from '../../../src/models/admin/users';

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

export const retrieveMetadata = async () => {
  let outcome = RetrieveMetadataOutcome();
  const metadataRef = db.collection("metadata").doc("users");
  const metadataDoc = await metadataRef.get();

  if (metadataDoc.exists) {
    outcome.success = true;
    outcome.data.totalUserCount = metadataDoc.data().totalUserCount;
    outcome.data.totalEnabledUsers = metadataDoc.data().totalEnabledUsers;
    outcome.data.totalDisabledUsers = metadataDoc.data().totalDisabledUsers;
  }

  return outcome;
};

export const retrieveAll = async (nextPageToken, numUsers = 100) => {
  let outcome = RetrieveAllUsersOutcome();
  let maxResults = ((Number(numUsers) > 100) || (Number(numUsers) <= 0) || (!Number.isInteger(numUsers))) ? 100 : Number(numUsers);
  try {
    const listUsersResult = await admin.auth().listUsers(
      maxResults,
      nextPageToken
    );
    let uidList = [];
    listUsersResult.users.forEach((userRecord) => {
      // We store the UID into a list to retrieve the additional details from Firestore
      uidList.push(userRecord.uid);
      // We write the details we have into the outcome list
      let user = FullUser();
      user.email = userRecord.email;
      user.uid = userRecord.uid;
      user.isAccEnabled = !userRecord.disabled;
      outcome.data.users.push(user);
    });

    // If there is a next page token, we return it to the user
    if (listUsersResult.pageToken) {
      outcome.data.nextPageToken = listUsersResult.pageToken;
    }

    // Retrieve the rest of the details from Firestore
    const usersRef = db.collection("users");
    const userDocsSnapshot = await usersRef.where(admin.firestore.FieldPath.documentId(), "in", uidList).get();

    if (!userDocsSnapshot.empty) {
      userDocsSnapshot.forEach((doc) => {
        const matchingUserIdx = outcome.data.users.findIndex((userObj) => userObj.uid === doc.id);
        outcome.data.users[matchingUserIdx].firstName = doc.data().personal.firstName;
        outcome.data.users[matchingUserIdx].lastName = doc.data().personal.lastName;
        outcome.data.users[matchingUserIdx].permissions = doc.data().dashboard.views;
      });

      outcome.success = true;
    } else {
      throw "When retrieving documents for the users, nothing was returned.";
    }

  } catch (error) {
    outcome.success = false;
    outcome.errorMsg = `Something has gone wrong with retrieving the list of users:\n${error}`;
  } finally {
    return outcome;
  }
};
