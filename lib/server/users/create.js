import { UserFormError } from './utils';
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const create = async (userDetails) => {
  let creationOutcome = {
    success: false,
    errors: null,
  };

  // If the userDetails object is null or undefined, we throw an error
  if (typeof(userDetails) === "undefined" || userDetails === null) {
    let creationError = UserFormError(
      ["The user details object provided is empty. Something has gone wrong."]
    );
    creationOutcome.errors = creationError;
    return creationOutcome;
  }

  // We create the user first
  try {
    const userRecord = await admin.auth().createUser({
      email: userDetails.email,
      password: `123456`,
      emailVerified: false,
      disabled: !userDetails.isEnabled,
      displayName: `${userDetails.firstName} ${userDetails.lastName}`
    });

    // We check if the user details has provided permissions
    if (Object.hasOwnProperty.call(userDetails, "permissions")) {
      const userPerms = userDetails.permissions;
      if (
        Object.hasOwnProperty.call(userPerms, "permissionClass") &&
        Object.hasOwnProperty.call(userPerms, "pages")
      ) {
        // Retrieve the list of available permissions in the database
        const permsRef = db.collection("definitions").doc("permissions");
        const permsDoc = await permsRef.get();

        if (permsDoc.exists) {
          // Variables to write to the user's profile in the database
          let validUserPermClass = "";
          let validUserPagePerms = [1];

          // Special flags for operations to additional actions to carry out for these pages
          let COPY_GEOMANCY_CAL = false;

          const permClassDef = permsDoc.data().pages.permissionClasses;
          // Check if the user's indicated class permission is valid
          if (userPerms.permissionClass.replace(/\s+/g, '') !== "") {
            // And if the indicated permission is a recognized one
            if (permClassDef.includes(userPerms.permissionClass)) {
              // We store it
              // If this is an 'Admin' class permission
              if (userPerms.permissionClass === "admin") {
                // We set the user up with all pages
                COPY_GEOMANCY_CAL = true;
                // We assign the user an admin token to be TRUE
                try {
                  await admin.auth().setCustomUserClaims(userRecord.uid, {
                    admin: true,
                  });
                } catch (error) {
                  console.log(error);
                  // Throw an error
                  let creationError = UserFormError(
                    ["Could not update the user's auth record."]
                  );
                  creationOutcome.success = false;
                  creationOutcome.errors = creationError;
                  return creationOutcome;
                }
              } else {
                // Else this is some other class permission,
                // Look through the pages permitted by this class permission
                // Check if there are any special actions to take
                const permittedPermTypeCodesDef = permsDoc.data().pages.typeCodes.filter((typeCodeObj) => {
                  return typeCodeObj.permissionClass === userPerms.permissionClass;
                });

                for (let i = 0; i < permittedPermTypeCodesDef.length; i += 1) {
                  if (permittedPermTypeCodesDef[i].typeCode === 0) {
                    COPY_GEOMANCY_CAL = true;
                    break;
                  }
                }

                // We assign the user an admin token to be FALSE
                try {
                  await admin.auth().setCustomUserClaims(userRecord.uid, {
                    admin: false,
                  });
                } catch (error) {
                  console.log(error);
                  // Throw an error
                  let creationError = UserFormError(
                    ["Could not update the user's auth record."]
                  );
                  creationOutcome.success = false;
                  creationOutcome.errors = creationError;
                  return creationOutcome;
                }
              }
              // Set the user's permission class to be written to the database
              validUserPermClass = userPerms.permissionClass;
              validUserPagePerms = [];
            }
          } else if (Array.isArray(userPerms.pages) && userPerms.pages.length > 0) {
            // Else we check if the user's indicated page permissions are valid
            const existingTypeCodes = permsDoc.data().pages.typeCodes.map((typeCodeObj) => typeCodeObj.typeCode);
            let validPagePerms = new Set().add(1);

            userPerms.pages.forEach((permTypeCode) => {
              if (existingTypeCodes.includes(permTypeCode)) {
                if (permTypeCode === 0) {
                  COPY_GEOMANCY_CAL = true;
                }
                validPagePerms.add(permTypeCode);
              }
            });

            validUserPagePerms = [...validPagePerms];
          } else {
            // Else the page permissions are invalid
            // delete the recently created user
            admin.auth().deleteUser(userRecord.uid);

            // Throw an error
            let creationError = UserFormError(
              ["The user's permissions are invalid."]
            );
            creationOutcome.success = false;
            creationOutcome.errors = creationError;
            return creationOutcome;
          }

          // Write the necessary changes to the database
          // Then we create the relevant records in the database as a single transaction
          // i.e. It all passes and the records get created, or it all fails
          try {
            await db.runTransaction(async (t) => {
              // Update the metadata about the users
              const metadataRef = db.collection("metadata").doc("users");
              // Get the current count of all users and update it with this newly created user
              const metadataDoc = await t.get(metadataRef);
              const newTotalUserCount = metadataDoc.data().totalUserCount + 1;
              const newTotalEnabledUserCount = metadataDoc.data().totalEnabledUsers + 1;
              t.update(metadataRef, {
                totalEnabledUsers: newTotalEnabledUserCount,
                totalUserCount: newTotalUserCount,
              });

              // Check if we need to copy the geomancy calendar settings
              if (COPY_GEOMANCY_CAL) {
                const calRef = db.collection("calendar").doc("l1y0yJQj3CeIFLHMLoYMJl6C44T2");
                const calDoc = await calRef.get();

                if (calDoc.exists) {
                  const newCalRef = db.collection("calendar").doc(userRecord.uid);
                  t.set(newCalRef, calDoc.data());
                }
              }

              // Create the user details entry in the database
              const usersRef = db.collection("users").doc(userRecord.uid);
              t.set(usersRef, {
                permissions: {
                  pages: validUserPagePerms,
                  permissionClass: validUserPermClass,
                },
                personal: {
                  firstName: userDetails.firstName,
                  lastName: userDetails.lastName,
                },
                lastEdited: new Date(),
              });

              creationOutcome.success = true;
            });
          } catch (error) {
            console.log(error);
            // delete the recently created user
            admin.auth().deleteUser(userRecord.uid);

            // throw an error
            let creationError = UserFormError(
              ["The transaction to create the user records has failed. Something has gone wrong."]
            );
            creationOutcome.errors = creationError;
            return creationOutcome;
          }
        } else {
          // Else we could not locate the document containing the permissions information
          // We delete the recently created user
          admin.auth().deleteUser(userRecord.uid);

          // We throw an error, citing that we were unable to locate the permissions in the database
          let creationError = UserFormError(
            ["Unable to locate the permissions data in the database. Something has gone wrong."]
          );
          creationOutcome.errors = creationError;
          return creationOutcome;
        }
      } else {
        // The user's permissions sent across do not have the required structure 
        // delete the recently created user
        admin.auth().deleteUser(userRecord.uid);

        // throw an error
        let creationError = UserFormError(
          ["The user's permissions sent across are missing crucial elements. Something has gone wrong."]
        );
        creationOutcome.errors = creationError;
        return creationOutcome;
      }
    } else {
      // If there isn't a "permissions" key, 
      // delete the newly created user
      admin.auth().deleteUser(userRecord.uid);

      // we throw an error
      let creationError = UserFormError(
        ["The permissions object is missing from the user details object. Something has gone wrong."]
      );
      creationOutcome.errors = creationError;
      return creationOutcome;
    }

    // Return the outcome as a success
    return creationOutcome;
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email": {
        let creationError = UserFormError(
          ["Invalid email address provided. Please use a valid email address."],
          ["email"]
        );
        creationOutcome.errors = creationError;
        break;
      }

      case "auth/email-already-exists": {
        let creationError = UserFormError(
          ["This email address is already in use."],
          ["email"]
        );
        creationOutcome.errors = creationError;
        break;
      }

      case "auth/invalid-display-name": {
        let creationError = UserFormError(
          ["Please provide a first name.", "Please provide a last name."],
          ["firstName", "lastName"]
        ); 
        creationOutcome.errors = creationError;
        break;
      }
    }

    return creationOutcome;
  }
};

export default create;
