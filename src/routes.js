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
      sublinks: [],
    },
    1: {
      title: "Profile",
      url: "/dashboard/profile",
      sublinks: [],
    },
    2: {
      title: "Instagram",
      url: "/dashboard/ig",
      sublinks: [],
    },
    1337: {
      title: "Admin",
      url: "/dashboard/admin",
      sublinks: [
        { title: "Users", "url": "/dashboard/admin/users" }
      ],
    },
  },
};

Object.freeze(routes);

export default routes;
