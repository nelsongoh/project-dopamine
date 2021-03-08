const Content = {
  webpage: {
    title: "Project Dopamine",
  },
  sidebar: {
    admin: {
      title: "Admin",
    },
  },
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
    title: "Project Dopamine",
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
    fragrances: {
      steps: [
        "Choose container size",
        "Select dilution level",
        "Decide fragrance function(s)",
        "Pick ingredients",
        "Adjust note proportions",
        "Distribute droplet counts"
      ],
      stepDesc: [
        "Choose a container volume which you would like to use for your fragrance. Alternatively, enter your custom volume.",
        "Select a dilution level for your fragrance.",
        "Decide the type of functions you would like for your fragrance.\nNOTE: Your selection here will determine the ingredients available in the next step.",
        "Pick the ingredients you would like to use for each of the Top, Middle, and Base notes.",
        "Adjust the volumetric proportion of your Top, Middle, and Base notes. The default proportion has been assigned as 30% (Top), 40% (Middle), and 30% (Base).\nNOTE: The proportion selected here will determine the available droplets in each note type in the next step.",
        "Distribute the droplet counts for each ingredient within each note type."
      ],
      stepDescUnknown: "Unknown step occurred. No known description found.",
      containerSizes: {
        ariaLabel: "Container size selection",
        name: "ContainerSizeSelection",
      },
      noteTypes: {
        top: "Top Notes",
        mid: "Middle Notes",
        base: "Base Notes",
      },
      dilutionLevels: {
        ariaLabel: "Dilution level selection",
        name: "DilutionLevelSelection",
      },
      noteProportions: {
        topNote: "Top Note Proportions",
        midNote: "Middle Note Proportions",
        botNote: "Base Note Proportions",
      }
    },
    admin: {
      users: {
        tabs: {
          create: "Create User",
          manage: "Manage Users"
        },
        create: {
          fields: {
            firstName: "First name",
            lastName: "Last name",
            email: "Email address",
            permissions: {
              title: "Permissions",
            },
          },
          btns: {
            cancel: "Cancel",
            submit: "Submit",
          },
          snackbar: {
            success: "User successfully created!",
          },
        },
        manage: {
          cols: {
            headers: {
              email: "Email address",
              firstName: "First name",
              lastName: "Last name",
              accStatus: {
                title: "Account status",
                types: {
                  enabled: "Enabled",
                  disabled: "Disabled",
                },
              },
              edit: {
                title: "Edit user",
                btn: "Edit",
              },
            },
          },
          editUserDialog: {
            title: "Edit user",
            accStatusEnabledTitle: "Account Enabled",
            accStatusDisabledTitle: "Account Disabled",
            accStatusAriaLabel: "account status toggle",
            updateSuccessSnackbarMsg: "User successfully updated!",
            updateFailureSnackbarMsg: "User update failed.",
          }
        },
      },
    },
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