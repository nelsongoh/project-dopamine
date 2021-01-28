const Content = {
  headerbar: {
    title: "吃 jiàk",
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
  },
}

Object.freeze(Content);

export default Content;