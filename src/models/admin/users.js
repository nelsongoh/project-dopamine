export const RetrieveMetadataOutcome = () => {
  return {
    success: false,
    data: {},
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

export const UserAuthRecord = (
  email = "",
  isAccEnabled = false,
  uid = "",
) => {
  return {
    email, isAccEnabled, uid,
  };
};
