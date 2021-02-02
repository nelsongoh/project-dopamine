export const RegisterUser = (
  firstName = "",
  lastName = "",
  email = "",
  permissions = [1],
) => {
  return {
    firstName, lastName, email, permissions,
  }
};

export const RegisterUserErrors = () => {
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
