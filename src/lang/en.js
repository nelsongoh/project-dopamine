const Content = {
  reauth: {
    title: "Re-authenticate your credentials",
    contentMsg: "Please re-enter your current login details to confirm your action.",
    emailField: "Email",
    pwdField: "Current password",
    errorMsg: "Invalid credentials",
    btns: {
      cancel: "Cancel",
      submit: "Submit",
    },
  },
  headerbar: {
    title: "吃 jiàk",
    menuBtn: {
      ariaLabel: "Open sidebar",
    },
    loginBtn: {
      title: "Login"
    },
    loggedInBtn: {
      ariaLabel: "Account of the current user",
      menu: {
        dashboard: "Dashboard",
        logout: "Logout",
      },
    },
  },
  pages: {
    login: {
      form: {
        email: {
          label: "Email address",
        },
        pwd: {
          label: "Password",
        },
      },
      btn: {
        title: "Login",
      }
    },
    calendar: {
      luckyDirections: {
        title: "Lucky Directions",
        directionBtns: {
          N: "N",
          NE: "NE",
          NW: "NW",
          S: "S",
          SE: "SE",
          SW: "SW",
          E: "E",
          W: "W",
          Central: "Central",
        },
      },
      luckyColors: {
        title: "Lucky Colours",
      },
    },
    profile: {
      textFields: {
        name: "Name",
        email: "Email address",
        newPwd: "New password",
        reEnterPwd: "Re-enter password",
        pwdErrorMsg: "Your new passwords don't match",
      },
      snackbar: {
        success: {
          msg: "Password successfully changed",
        },
      },
    },
  },
}

Object.freeze(Content);

export default Content;