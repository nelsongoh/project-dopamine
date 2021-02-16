import { UserPermissions } from '../src/models/register';
import { cloneDeep } from 'lodash/lang'

export const userPermissionSetToArray = (userDetailsObj) => {
  let deepCopy = cloneDeep(userDetailsObj);

  if (deepCopy !== null && typeof(deepCopy) !== "undefined") {
    if (Object.hasOwnProperty.call(deepCopy, "permissions")) {
      if (Object.hasOwnProperty.call(deepCopy.permissions, "pages")) {
        deepCopy.permissions.pages = Array.from(deepCopy.permissions.pages);
        return deepCopy;
      }
    }
  }

  return;
};

export const transformToUserPermissions = (permsObj) => {
  let outputPerms = UserPermissions();

  if (
    Object.hasOwnProperty.call(permsObj, "classPerms") &&
    Object.hasOwnProperty.call(permsObj, "pagePerms")
  ) {
    let permClasses = Object.keys(permsObj.classPerms);
    let permPageCats = Object.keys(permsObj.pagePerms);

    if (permClasses.length > 0) {
      for (let i = 0; i < permClasses.length; i += 1) {
        if (permsObj.classPerms[permClasses[i]] === true) {
          outputPerms.permissionClass = permClasses[i];
          return outputPerms;
        }
      }
    }
    
    if (permPageCats.length > 0) {
      permPageCats.map((permCat) => {
        Object.keys(permsObj.pagePerms[permCat]).map((permTypeCode) => {
          if (permsObj.pagePerms[permCat][permTypeCode] === true) {
            outputPerms.pages.add(Number(permTypeCode));
          }
        });
      });
    }
  }
  return outputPerms;
};

export const transformToInitialSelectedPerms = (permsObj) => {
  let initPerms = {
    classPerms: {},
    pagePerms: {},
  };

  // For the class-based permissions
  permsObj.pages.permissionClasses.map((perm) => {
    initPerms.classPerms[perm] = false;
    initPerms.pagePerms[perm] = {};
  });

  // For the specific page-type permissions
  permsObj.pages.typeCodes.map((perm) => {
    if (perm.title.toLowerCase() !== "profile") {
      initPerms.pagePerms[perm.permissionClass][perm.typeCode] = false;
    } else {
      initPerms.pagePerms[perm.permissionClass][perm.typeCode] = true;
    }
  });
  return initPerms;
};

export const validatePermsObj = (permsObj) => {
  if (permsObj !== null && typeof(permsObj) === "object") {
    if (Object.hasOwnProperty.call(permsObj, "pages")) {
      if (
        Object.hasOwnProperty.call(permsObj.pages, "permissionClasses") &&
        Object.hasOwnProperty.call(permsObj.pages, "typeCodes")
      ) {
        return true;
      }
    }
  }

  return false;
}

export const validateExistingPerms = (permsObj) => {
  if (permsObj !== null && typeof(permsObj) === "object") {
    if (
      Object.hasOwnProperty.call(permsObj, "pages") &&
      Object.hasOwnProperty.call(permsObj, "permissionClass")
    ) {
      if (
        Array.isArray(permsObj.pages) &&
        typeof(permsObj.permissionClass) === "string"
      ) {
        return true;
      }
    }
  }

  return false;
};
