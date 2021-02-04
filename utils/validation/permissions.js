export const validatePermsList = (permsList) => {
  if (Array.isArray(permsList)) {
    return permsList.every((perm) => Number.isInteger(perm));
  } else {
    return false;
  }
};
