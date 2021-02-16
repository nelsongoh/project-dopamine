import { User, UserPermissions } from '../../src/models/register';
import { isEqual, cloneDeep } from 'lodash/lang';

export const validateUserEditProfile = (pwdOne, pwdTwo) => {
  if (pwdOne === pwdTwo) {
    return true;
  }
  
  return false;
};

export const isValidUserObject = (compareObj) => {
  let isObjKeysValid = Object.keys(compareObj).every((compareObjKey) => (
    Object.hasOwnProperty.call(User(), compareObjKey)
  ));

  let isObjValTypesValid = Object.keys(User()).every((userObjKey) => {
    let isValTypeValid = typeof(User()[userObjKey]) === typeof(compareObj[userObjKey]);

    return isValTypeValid;
  });

  return isObjKeysValid && isObjValTypesValid;
};

export const isValidPermissionObject = (compareObj) => {
  let isObjKeysValid = Object.keys(compareObj).every((compareObjKey) => (
    Object.hasOwnProperty.call(UserPermissions(), compareObjKey)
  ));
  
  if (isObjKeysValid) {
    let isObjValTypesValid = Object.keys(UserPermissions()).every((userObjKey) => {
      let isValTypeValid = typeof(UserPermissions()[userObjKey]) === typeof(compareObj[userObjKey]);
  
      if (UserPermissions()[userObjKey] instanceof Set) {
        isValTypeValid = isValTypeValid && (compareObj[userObjKey] instanceof Set);
        // If this is a set of page permissions, we check if there has been a permission class assigned
        // If NO permission has been assigned
        if (compareObj.permissionClass.replaceAll(" ", "").toLowerCase() === "") {
          // Then we check that the set of page permissions includes the profile page
          isValTypeValid = isValTypeValid && compareObj[userObjKey].has(1)
        }
      }
  
      return isValTypeValid;
    });

    return isObjValTypesValid;
  }

  return false;
};

export const isUserNonEmpty = (details) => {
  if (isValidUserObject(details)) {
    const userDetails = {...User(), ...details};

    return Object.keys(userDetails).every((objKey) => {
      if (typeof(userDetails[objKey]) === "string") {
        if (userDetails[objKey].replaceAll(" ", "") !== "") {
          return true;
        } else {
          return false;
        }
      } else if (typeof(userDetails[objKey]) === "object") {
        if (isValidPermissionObject(userDetails[objKey])) {
          return true;
        } else {
          return false;
        }
      } else if (typeof(userDetails[objKey]) === "boolean") {
        return true;
      } else {
        // Else there is a type in here that we don't recognize in the User object
        return false;
      }
    });
  }

  return false;
};

export const validateAdminEditUser = (edited, original) => {
  let originalArrayToSet = cloneDeep(original);
  originalArrayToSet.permissions.pages = new Set(originalArrayToSet.permissions.pages);

  // Check if the provided user detail objects are NOT
  // exactly the same, otherwise return false
  if (!isEqual(edited, originalArrayToSet)) {
    // Check if the provided user detail objects
    // have the same keys and value types
    if (isValidUserObject(edited) && isValidUserObject(originalArrayToSet)) {
      // Check if the edited User object is not empty
      if (isUserNonEmpty(edited)) {
        return true;
      }
    }
  }

  return false;
};
