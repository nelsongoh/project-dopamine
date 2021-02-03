import { RegisterUserErrors } from '../../../src/models/register';
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const create = async (userDetails) => {
  let creationOutcome = {
    success: true,
    errors: null,
  };

  let creationErrors = RegisterUserErrors();
  // If the userDetails object is null or undefined, we throw an error
  if (typeof(userDetails) === "undefined" || userDetails === null) {
    creationErrors.email.hasError = true;
    creationErrors.email.errorMsg = "The user details object provided is empty. Something has gone wrong.";
    creationErrors.firstName.hasError = true;
    creationErrors.firstName.errorMsg = "The user details object provided is empty. Something has gone wrong.";
    creationErrors.lastName.hasError = true;
    creationErrors.lastName.errorMsg = "The user details object provided is empty. Something has gone wrong.";
    creationOutcome.success = false;
    creationOutcome.errors = creationErrors;
    return creationOutcome;
  }

  // We create the user first
  try {
    const userRecord = await admin.auth().createUser({
      email: userDetails.email,
      password: `123456`,
      emailVerified: false,
      disabled: false,
      displayName: `${userDetails.firstName} ${userDetails.lastName}`
    });

    // We check if the user details has provided permissions
    if (userDetails.hasOwnProperty("permissions")) {
      const userPerms = userDetails.permissions;
      if (userPerms.length === 0) {
        // If there are no permissions selected for the user, 
        // delete the recently created user
        admin.auth().deleteUser(userRecord.uid);

        // throw an error
        creationErrors.email.hasError = true;
        creationErrors.email.errorMsg = "No permissions were selected for the user. Something has gone wrong.";
        creationErrors.firstName.hasError = true;
        creationErrors.firstName.errorMsg = "No permissions were selected for the user. Something has gone wrong.";
        creationErrors.lastName.hasError = true;
        creationErrors.lastName.errorMsg = "No permissions were selected for the user. Something has gone wrong.";
        creationOutcome.success = false;
        creationOutcome.errors = creationErrors;
        return creationOutcome;
      }

      // Retrieve the list of available permissions in the database
      const permsRef = db.collection("permissions").doc("pages");
      const permsDoc = await permsRef.get();

      if (permsDoc.exists) {
        const listOfPerms = Object.keys(permsDoc.data());
        let validUserPerms = [];
        let copyGeomancyCal = false;
        for (let i = 0; i < userPerms.length; i += 1) {
          for (let j = 0; j < listOfPerms.length; j += 1) {
            // If this is a valid permission, we add it to a temporary list to store later 
            if (userPerms[i] === listOfPerms[j]) {
              validUserPerms.push(Number(userPerms[i]));
              if (Number(userPerms[i]) === 0) {
                copyGeomancyCal = true;
              }
              break;
            }
          }
        }

        if (validUserPerms.length === 0) {
          // There are no valid permissions for the user found, 
          // delete the newly created user
          admin.auth().deleteUser(userRecord.uid);

          // we throw an error
          creationErrors.email.hasError = true;
          creationErrors.email.errorMsg = "No valid permissions were found for the user. Something has gone wrong.";
          creationErrors.firstName.hasError = true;
          creationErrors.firstName.errorMsg = "No valid permissions were found for the user. Something has gone wrong.";
          creationErrors.lastName.hasError = true;
          creationErrors.lastName.errorMsg = "No valid permissions were found for the user. Something has gone wrong.";
          creationOutcome.success = false;
          creationOutcome.errors = creationErrors;
          return creationOutcome;
        } else {
          // Else everything is valid, we proceed to create the related entries in the database
          try {
            await db.runTransaction(async (t) => {
              if (copyGeomancyCal) {
                const calRef = db.collection("calendar").doc("l1y0yJQj3CeIFLHMLoYMJl6C44T2");
                const calDoc = await calRef.get();

                if (calDoc.exists) {
                  const newCalRef = db.collection("calendar").doc(userRecord.uid);
                  t.set(newCalRef, calDoc.data());
                }
              }

              const usersRef = db.collection("users").doc(userRecord.uid);
              t.set(usersRef, {
                dashboard: {
                  views: validUserPerms,
                },
                personal: {
                  firstName: userDetails.firstName,
                  lastName: userDetails.lastName,
                },
              });
            });

            // Update the metadata about the users
            try {
              await db.runTransaction(async (t) => {
                const metadataRef = db.collection("metadata").doc("users");
                // Get the current count of all users and update it with this newly created user
                const metadataDoc = await t.get(metadataRef);
                const newTotalUserCount = metadataDoc.data().totalUserCount + 1;
                const newTotalEnabledUserCount = metadataDoc.data().totalEnabledUsers + 1;
                t.update(metadataRef, {
                  totalEnabledUsers: newTotalEnabledUserCount,
                  totalUserCount: newTotalUserCount,
                })
              });
            } catch (error) {
              ;
            }

          } catch (error) {
            // delete the recently created user
            admin.auth().deleteUser(userRecord.uid);

            // throw an error
            creationErrors.email.hasError = true;
            creationErrors.email.errorMsg = "The transaction to create the user records has failed. Something has gone wrong.";
            creationErrors.firstName.hasError = true;
            creationErrors.firstName.errorMsg = "The transaction to create the user records has failed. Something has gone wrong.";
            creationErrors.lastName.hasError = true;
            creationErrors.lastName.errorMsg = "The transaction to create the user records has failed. Something has gone wrong.";
            creationOutcome.success = false;
            creationOutcome.errors = creationErrors;
            return creationOutcome;
          }
        }
      } else {
        // We delete the recently created user
        admin.auth().deleteUser(userRecord.uid);

        // We throw an error, citing that we were unable to locate the permissions in the database
        creationErrors.email.hasError = true;
        creationErrors.email.errorMsg = "Unable to locate the permissions data in the database. Something has gone wrong.";
        creationErrors.firstName.hasError = true;
        creationErrors.firstName.errorMsg = "Unable to locate the permissions data in the database. Something has gone wrong.";
        creationErrors.lastName.hasError = true;
        creationErrors.lastName.errorMsg = "Unable to locate the permissions data in the database. Something has gone wrong.";
        creationOutcome.success = false;
        creationOutcome.errors = creationErrors;
        return creationOutcome;
      }

    } else {
      // If there isn't a "permissions" key, 
      // delete the newly created user
      admin.auth().deleteUser(userRecord.uid);

      // we throw an error
      creationErrors.email.hasError = true;
      creationErrors.email.errorMsg = "The permissions array is missing from the user details object. Something has gone wrong.";
      creationErrors.firstName.hasError = true;
      creationErrors.firstName.errorMsg = "The permissions array is missing from the user details object. Something has gone wrong.";
      creationErrors.lastName.hasError = true;
      creationErrors.lastName.errorMsg = "The permissions array is missing from the user details object. Something has gone wrong.";
      creationOutcome.success = false;
      creationOutcome.errors = creationErrors;
      return creationOutcome;
    }

    // Then we create the relevant records in the database as a single transaction
    // i.e. It all passes and the records get created, or it all fails
    return creationOutcome;
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email":
        creationErrors.email.hasError = true;
        creationErrors.email.errorMsg = "Invalid email address provided. Please use a valid email address."
        creationOutcome.success = false;
        creationOutcome.errors = creationErrors;
        break;

      case "auth/email-already-exists":
        creationErrors.email.hasError = true;
        creationErrors.email.errorMsg = "This email address is already in use."
        creationOutcome.success = false;
        creationOutcome.errors = creationErrors;
        break;

      case "auth/invalid-display-name":
        creationErrors.firstName.hasError = true;
        creationErrors.firstName.errorMsg = "Please provide a first name.";
        creationErrors.lastName.hasError = true;
        creationErrors.lastName.errorMsg = "Please provide a last name."
        creationOutcome.success = false;
        creationOutcome.errors = creationErrors;
        break;
    }

    return creationOutcome;
  }
};

export default create;
