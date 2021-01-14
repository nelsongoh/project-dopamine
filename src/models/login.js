export const User = (email = "", pwd = "") => {
  return {
    email,
    pwd
  }
}

export const LoginErrors = () => {
  return {
    email: {
      hasError: false,
      msg: "",
    },
    pwd: {
      hasError: false,
      msg: ""
    },
  }
}
