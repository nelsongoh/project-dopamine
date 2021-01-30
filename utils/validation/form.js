export const validateEditProfile = (pwdOne, pwdTwo) => {
  if (pwdOne === pwdTwo) {
    return true;
  }
  
  return false;
};