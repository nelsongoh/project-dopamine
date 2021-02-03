export const RetrieveMetadataOutcome = () => {
  return {
    success: false,
    data: {
      totalUserCount: -1,
      totalEnabledUsers: -1,
      totalDisabledUsers: -1,
    },
    errorMsg: "",
  }
}

export const RetrieveAllUsersOutcome = () => {
  return {
    success: false,
    data: {
      nextPageToken: null,
      users: [],
    },
    errorMsg: "",
  };
};

export const FullUser = (
  email = "",
  firstName = "",
  lastName = "",
  isAccEnabled = false,
  uid = "",
  permissions = [],
) => {
  return {
    email, firstName, lastName, isAccEnabled, uid, permissions,
  };
};
