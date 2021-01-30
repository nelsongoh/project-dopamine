export const Profile = (newPwd = "", reEnterPwd = "") => {
  return {
    newPwd, reEnterPwd,
  };
};

export const ProfileErrors = () => {
  return {
    newPwd: {
      hasError: false,
      errorMsg: "",
    },
    reEnterPwd: {
      hasError: false,
      errorMsg: "",
    },
  };
};

export const PwdChangeErrors = () => {
  return {
    reqReLogin: false,
    isPwdWeak: false,
    others: false,
  };
};
