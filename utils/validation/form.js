import { RegisterUser } from '../../src/models/register';

export const validateEditProfile = (pwdOne, pwdTwo) => {
  if (pwdOne === pwdTwo) {
    return true;
  }
  
  return false;
};

export const validateAdminCreateUser = (details) => {
  const userDetails = {...RegisterUser(), ...details};

  return Object.keys(userDetails).every((objKey) => {
    if (typeof(userDetails[objKey]) === "string") {
      if (userDetails[objKey].replaceAll(" ", "") !== "") {
        return true;
      } else {
        return false;
      }
    } else if (Array.isArray(userDetails[objKey])) {
      if (userDetails[objKey].length > 0) {
        return true;
      } else {
        return false;
      }
    }
  })
};
