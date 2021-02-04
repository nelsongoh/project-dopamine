export const User = (
  firstName = "",
  lastName = "",
  email = "",
  permissions = [1],
) => {
  return {
    firstName, lastName, email, permissions,
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
