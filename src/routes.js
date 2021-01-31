// The key in the object is the permission, while the value maps to the route
const routes = {
  public: {
    index: "/",
    login: "/login",
  },
  protected: {
    dashboard: "/dashboard",
    0: {
      title: "Calendar",
      url: "/dashboard/calendar",
    },
    1: {
      title: "Profile",
      url: "/dashboard/profile",
    },
    2: {
      title: "Instagram",
      url: "/dashboard/ig",
    },
  },
};

Object.freeze(routes);

export default routes;
