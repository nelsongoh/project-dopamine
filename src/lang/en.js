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
  },
}

Object.freeze(Content);

export default Content;