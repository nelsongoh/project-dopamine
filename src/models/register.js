export const UserPermissions = (
  permissionClass = "",
  pages = new Set(),
) => {
  return {
    permissionClass,
    pages,
  }
};

export const User = (
  firstName = "",
  lastName = "",
  email = "",
  isEnabled = false,
  permissions = UserPermissions(),
) => {
  return {
    firstName, lastName, email, isEnabled, permissions,
  }
};

export const UserErrors = () => {
  return {
    firstName: {
      hasError: false,
      errorMsg: "",
    },
    lastName: {
      hasError: false,
      errorMsg: "",
    },
    email: {
      hasError: false,
      errorMsg: "",
    },
  }
};
