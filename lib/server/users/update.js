import { UserFormError } from './utils';
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const update = async (userData) => {
  let updateOutcome = { success: false, errors: null };

  // If the userData object is null or undefined, we throw an error
  if (typeof(userData) === "undefined" || userData === null) {
    let formError = UserFormError(
      ["The user data object provided is empty. Something has gone wrong."]
    );
    updateOutcome.errors = formError;
    return updateOutcome;
  }

  let fieldsToChange = {
    firstName: false,
    lastName: false,
    isEnabled: false,
    permissionClass: false,
    permissionPages: false,
  };

  // We need a reference to the profile page's type code
  // to perform a check later on, to ensure that the page
  // permission include this
  let profilePageTypeCode = null;
  // Reference to the calendar page's permission definition
  // We need this to determine if we need to add / remove the user's
  // entry in the "Calendar" collection
  let calendarPagePermDef = null;

  // We check if there is a valid first name
  if (Object.hasOwnProperty.call(userData, "firstName")) {
    if (userData.firstName.replace(" ", "") !== "") {
      fieldsToChange.firstName = true;
    }
  }
  // We check if there is a valid last name
  if (Object.hasOwnProperty.call(userData, "lastName")) {
    if (userData.lastName.replace(" ", "") !== "") {
      fieldsToChange.lastName = true;
    }
  }
  // We check if there is a valid boolean value for the user's enabled status
  if (Object.hasOwnProperty.call(userData, "isEnabled")) {
    if (typeof(userData.isEnabled) === "boolean") {
      fieldsToChange.isEnabled = true;
    }
  }

  // The document reference to the permissions definition
  let permsDefRef = null;
  // The document for the permissions definition
  let permsDefDoc = null;
  // The user's CURRENT details document reference from Firestore
  let userDetailsRef = null;
  // The user's CURRENT details from Firestore
  let userDetailsDoc = null;

  // We retrieve the list of available permissions
  try {
    permsDefRef = db.collection("definitions").doc("permissions");
    permsDefDoc = await permsDefRef.get();
    let permClasses = [];
    let permTypes = [];
    if (permsDefDoc.exists) {
      permClasses = permsDefDoc.data().pages.permissionClasses;
      permTypes = permsDefDoc.data().pages.typeCodes.map((typeCodeObj) => {
        if (typeCodeObj.title.toLowerCase() === "profile") {
          profilePageTypeCode = typeCodeObj.typeCode;
        } else if (typeCodeObj.title.toLowerCase() === "geomancy calendar") {
          calendarPagePermDef = typeCodeObj;
        }
        return typeCodeObj.typeCode
      });
    } else {
      // We have an issue: The permissions definition document couldn't be found
      let formError = UserFormError(
        ["There was an issue retrieving the permission definitions."]
      );
      updateOutcome.errors = formError;
      return updateOutcome;
    }
    
    // Retrieving the user details reference and document
    try {
      userDetailsRef = db.collection("users").doc(userData.uid);
      userDetailsDoc = await userDetailsRef.get();
      if (userDetailsDoc.exists) {
        console.log(`SUCCESS: Retrieved the user's document reference and document data.`);
      } else {
        throw "ERROR: The user's details document from Firestore could not be found.";
      }
    } catch (error) {
      console.log(error);
      let formError = UserFormError(
        ["An error occurred while trying to retrieve the user document from the collection."]
      );
      updateOutcome.errors = formError;
      return updateOutcome;
    }

    // We check if there is a permissions object in the data provided
    if (Object.hasOwnProperty.call(userData, "permissions")) {
      if (Object.hasOwnProperty.call(userData.permissions, "permissionClass")) {
        // If the permissions class we want to update to exists in the
        // list of available permissions
        if (permClasses.includes(userData.permissions.permissionClass)) {
          fieldsToChange.permissionClass = true;
          // We ignore the page permissions
          fieldsToChange.permissionPages = false;
        }
        // Else if the permission class we want to update to, is to remove the
        // permission class, i.e. From permission class X to ""
        else if (
          userDetailsDoc.data().permissions.permissionClass !== "" &&
          userData.permissions.permissionClass === ""
        ) {
          fieldsToChange.permissionClass = true;
          fieldsToChange.permissionPages = true;
        }
        // Else we check if there are page permissions specified for the user
        else if (Object.hasOwnProperty.call(userData.permissions, "pages")) {
          // If each of the page permissions are valid
          fieldsToChange.permissionPages = userData.permissions.pages.every((permCode) => {
            // If the permission code exists in the list of available permissions
            if (permTypes.includes(permCode)) {
              return true;
            }
            return false;
          });
  
          // If the page permissions should be edited, then the permission class should not be
          if (fieldsToChange.permissionPages) {
            fieldsToChange.permissionClass = false;
          }
          console.log(`Should we change the page permissions: ${fieldsToChange.permissionPages}`);
        }
      }
    }
    console.log(`SUCCESS: Retrieved the permission definitions.`);
  } catch (error) {
    console.log(error);
    console.log("Error with retrieving the permission definitions.");
    let formError = UserFormError(
      ["There was an issue retrieving the permission definitions."]
    );
    updateOutcome.errors = formError;
    return updateOutcome;
  }

  // Now we update the fields which are valid for updating
  // Starting with the Firestore entries

  // null indicates that the user IS NOT an admin, and the auth token does not need to be set
  // true indicates that the user IS an admin, and the auth token needs to be assigned
  // false indicates that the user WAS an admin, and the auth token needs to be revoked
  let shouldSetUserAdminToken = null;
  // The user's auth record
  let userRecord = null;
  // The reference calendar's document reference from Firestore
  let calRef = null;
  // The reference calendar's document from Firestore
  let calDoc = null;
  // The calendar document reference for the user to update
  let calCopyRef = null;
  // The calendar document for the user to update
  let calCopyDoc = null;

  try {
    // We retrieve the user's auth record first
    // This is the user's auth record BEFORE the update
    try {
      userRecord = await admin.auth().getUser(userData.uid);
      console.log(`SUCCESS: Retrieved the user's auth record.`);
    }
    catch (error) {
      console.log(error);
      let formError = UserFormError(
        ["There was an issue retrieving the user's record."]
      );
      updateOutcome.errors = formError;
      return updateOutcome;
    }

    await db.runTransaction(async (t) => {
      // Retrieving the reference calendar's details document reference and data
      try {
        calRef = db.collection("calendar").doc("l1y0yJQj3CeIFLHMLoYMJl6C44T2");
        calDoc = await calRef.get();
        console.log(`SUCCESS: Retrieved the calendar document reference and document data.`);
      } catch (error) {
        console.log(error);
        let formError = UserFormError(
          ["An error occurred while trying to retrieve the calendar document from the collection."]
        );
        updateOutcome.errors = formError;
        return updateOutcome;
      }

      // Retrieving the user's calendar document reference and data
      try {
        calCopyRef = db.collection("calendar").doc(userData.uid);
        calCopyDoc = await calRef.get();
        console.log(`SUCCESS: Retrieved the user's calendar document reference and data.`);
      } catch (error) {
        console.log(error);
        let formError = UserFormError(
          ["An error occurred while trying to retrieve the user's calendar document from the collection."]
        );
        updateOutcome.errors = formError;
        return updateOutcome;
      }

      // If we need to update the isEnabled field
      if (fieldsToChange.isEnabled) {
        // If there is a difference between what we have, and what
        // we need to set
        if (userRecord.disabled === userData.isEnabled) {
          // We read in the metadata
          try {
            const metadataRef = db.collection("metadata").doc("users");
            const metadataDoc = await t.get(metadataRef);

            if (metadataDoc.exists) {
              let currTotalEnabledUserCount = metadataDoc.data().totalEnabledUsers;
              let currTotalDisabledUserCount = metadataDoc.data().totalDisabledUsers;

              if (userData.isEnabled) {
                currTotalEnabledUserCount += 1;
                currTotalDisabledUserCount -= 1;
              } else {
                currTotalEnabledUserCount -= 1;
                currTotalDisabledUserCount += 1;
              }
              t.update(metadataRef, {
                totalEnabledUsers: currTotalEnabledUserCount,
                totalDisabledUsers: currTotalDisabledUserCount,
              });
              console.log(`SUCCESS: Retrieved and updated user metadata.`);
            } else {
              console.log(`FAILURE: Could not locate user metadata.`);
              let formError = UserFormError(
                ["Could not locate the user metadata document."]
              );
              updateOutcome.errors = formError;
              return updateOutcome;
            }
          } catch (error) {
            console.log(`FAILURE: Could not retrieve user metadata.`);
            console.log(error);
            let formError = UserFormError(
              ["There was an issue retrieving the user metadata."]
            );
            updateOutcome.errors = formError;
            return updateOutcome;
          }
        }
      }
      // If we need to update the permission class
      if (fieldsToChange.permissionClass) {
        if (userDetailsDoc.exists) {
          // In all scenarios, we need to change the user's permission class, so:
          t.update(userDetailsRef, {
            "permissions.permissionClass": userData.permissions.permissionClass,
          });

          // We read in the user's current permission class
          const currUserPermClass = userDetailsDoc.data().permissions.permissionClass;

          // Then we check if we're CHANGING permissions, i.e. Permission X -> Permission Y
          if (userData.permissions.permissionClass !== "") {
            // If the current permission class is 'admin', and the permission class to switch to is not,
            // The admin token on the auth user also needs to be removed
            // ADMIN -> NON-ADMIN
            if (currUserPermClass === "admin" && userData.permissions.permissionClass !== "admin") {
              shouldSetUserAdminToken = false;
            } 
            // NON-ADMIN -> ADMIN
            else if (userData.permissions.permissionClass === "admin" && currUserPermClass !== "admin") {
              shouldSetUserAdminToken = true;
            }
            // "" -> PERMISSION CLASS X
            // OR
            // PERMISSION CLASS Y -> PERMISSION CLASS X
            else {
              shouldSetUserAdminToken = null;
            }
            // After setting the user permission class, we need to remove all the user's page permissions
            t.update(userDetailsRef, {
              "permissions.pages": [],
            });
          }
          // We check to see if this class requires a Calendar entry
          // i.e. It's the admin class, or the class matching the Calendar page's
          // permission class
          if (
            userData.permissions.permissionClass === "admin" ||
            userData.permissions.permissionClass === calendarPagePermDef.permissionClass
          ) {
            t.set(calCopyRef, calDoc.data());
          } else {
            // Else the user's permission class does not allow for a calendar,
            // we remove the Calendar entry
            t.delete(calCopyRef);
          }
        } else {
          console.log(`FAILURE: Could not locate the document containing the user's details.`);
          let formError = UserFormError(
            ["Could not locate the document for the user's details."]
          );
          updateOutcome.errors = formError;
          return updateOutcome;
        }
      }
      // If we need to update the page permissions
      if (fieldsToChange.permissionPages) {
        if (userDetailsDoc.exists) {
          // If we didn't identify a type code for the profile page permission
          if (profilePageTypeCode === null) {
            // We throw an error
            console.log(`FAILURE: Profile page type code not found.`);
            let formError = UserFormError(
              ["Could not identify the profile page type code."]
            );
            updateOutcome.errors = formError;
            return updateOutcome;
          }
          // Earlier we only checked the validity of the page permissions, i.e.
          // Does every permission that we want to assign, exist in the list of current
          // page permissions?
          // Now we check to ensure that the page permissions include one for the profile page
          // If it doesn't, we add it in
          if (!userData.permissions.pages.includes(profilePageTypeCode)) {
            userData.permissions.pages.push(profilePageTypeCode);
          }
          
          if (calDoc.exists) {
            // We need to check if we're adding / removing the "Calendar" page
            // If the calendar page permission is present in the set of page permissions
            if (
              calendarPagePermDef !== null &&
              userData.permissions.pages.includes(calendarPagePermDef.typeCode)
            ) {
              // We copy a set of the Calendar data for this user
              t.set(calCopyRef, calDoc.data());
            } 
            // Else if the calendar page permission WAS present in the original set
            // of page permissions, but is not now
            else if (
              userDetailsDoc.exists &&
              userDetailsDoc.data().permissions.pages.includes(calendarPagePermDef.typeCode) &&
              !userData.permissions.pages.includes(calendarPagePermDef.typeCode)
            ) {
              t.delete(calCopyRef);
            }
          } else {
            console.log(`FAILURE: Could not locate the document for the calendar details.`);
            let formError = UserFormError(
              ["Could not locate the document for the calendar details."]
            );
            updateOutcome.errors = formError;
            return updateOutcome;
          }

          // We update the user's page permissions
          // and remove their permission class
          t.update(userDetailsRef, {
            "permissions.pages": userData.permissions.pages,
            "permissions.permissionClass": "",
          });
        } else {
          console.log(`FAILURE: Could not locate the document for the user's details.`);
          let formError = UserFormError(
            ["Could not locate the document for the user's details."]
          );
          updateOutcome.errors = formError;
          return updateOutcome;
        }
      }
      // If we need to update the first name field
      if (fieldsToChange.firstName) {
        t.update(userDetailsRef, {
          "personal.firstName": userData.firstName,
        });
      }
      // If we need to update the last name field
      if (fieldsToChange.lastName) {
        t.update(userDetailsRef, {
          "personal.lastName": userData.lastName,
        });
      }
    });

    console.log(`SUCCESS: Transaction for Firestore user details update completed.`);

    // We proceed to update the user auth data
    try {
      // Either both the user update and admin token updates (where applicable) succeed,
      // or they both field, and an error is thrown
      await Promise.all([
        admin.auth().updateUser(userData.uid, {
          disabled: fieldsToChange.isEnabled ? !userData.isEnabled : userRecord.disabled,
          // Here we check if we're only changing the user's first name (then we keep the existing last name)
          // or if we're only changing the user's last name (then we keep the existing first name)
          // or if we're changing the user's first and last name (then we overwrite both)
          // or if we're not changing anything (then we keep the display name as the same)
          displayName: fieldsToChange.firstName && fieldsToChange.lastName ? 
            `${userData.firstName} ${userData.lastName}` : (
              fieldsToChange.firstName ? `${userData.firstName} ${userDetailsDoc.personal.lastName}` : (
                fieldsToChange.lastName ? `${userDetailsDoc.personal.firstName} ${userData.lastName}` :
                userRecord.displayName
              )
            )
        }),
        // If we need to make changes to the user's admin token status
        // we append it into the Promise array
        shouldSetUserAdminToken !== null ? (
          await admin.auth().setCustomUserClaims(userData.uid, {
            admin: shouldSetUserAdminToken
          })
        ) : null,
      ]);

      console.log(`SUCCESS: Updated the user's details and set their custom token claims.`);
    } catch (error) {
      console.log(error);
      throw "There was an issue updating the user's auth data / custom token.";
    }
    // Then at the end of it all, we update the lastEdited timestamp for the user
    try {
      await userDetailsRef.update({
        lastEdited: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`SUCCESS: Updated the "Last Edited" timestamp.`);
    } catch (error) {
      console.log(error);
      throw "There was an error updating the user's 'Last Edited' timestamp.";
    }

    // If we get to this point, then we have succeeded in the update
    updateOutcome.success = true;
    console.log(`SUCCESS: ENTIRE UPDATE SUCCESSFUL.`);
  } catch (error) {
    console.log(error);
    console.log(`FAILURE: Rolling back user auth data update.`);
    // If we reach this point, then there was an error with either: 
    // 1) The update of the auth user
    // 2) The update transaction for the user's details in Firestore
    // Either way, we rollback the user auth data back to its original form when we first retrieved it
    try {
      await admin.auth().updateUser(userData.uid, {
        displayName: userRecord.displayName,
        disabled: userRecord.disabled,
      });
      console.log(`SUCCESS: User auth data rollback successful.`);
    } catch (error) {
      console.log(error);
      let formError = UserFormError(
        ["There was an issue retrieving the user's record."]
      );
      updateOutcome.errors = formError;
      return updateOutcome;
    }
  } finally {
    return updateOutcome;
  }
};

export default update;
